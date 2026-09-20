import { beforeEach, describe, expect, test } from "vitest";

import type { APICallerType, CustomTestContext } from "../testUtils";
import { defaultBeforeEach } from "../testUtils";
import { List } from "../models/lists";

beforeEach<CustomTestContext>(defaultBeforeEach(true));

/**
 * Helper function to add a collaborator and have them accept the invitation
 */
async function addAndAcceptCollaborator(
  ownerApi: APICallerType,
  collaboratorApi: APICallerType,
  listId: string,
  role: "viewer" | "editor",
) {
  const collaboratorUser = await collaboratorApi.users.whoami();

  const { invitationId } = await ownerApi.lists.addCollaborator({
    listId,
    email: collaboratorUser.email!,
    role,
  });

  await collaboratorApi.lists.acceptInvitation({
    invitationId,
  });
}

describe("Subtree Permissions Calculation (Step 1)", () => {
  test<CustomTestContext>("should calculate direct and inherited permissions for candidate users across subtree", async ({
    apiCallers,
    db,
  }) => {
    const ownerApi = apiCallers[0];
    const collaboratorApi = apiCallers[1];

    const collaboratorUser = await collaboratorApi.users.whoami();
    const collaboratorId = collaboratorUser.id;

    // 1. Create a 3-level hierarchy: Parent -> Child -> GrandChild
    const parentList = await ownerApi.lists.create({
      name: "Parent List",
      icon: "📁",
      type: "manual",
    });

    const childList = await ownerApi.lists.create({
      name: "Child List",
      icon: "📄",
      type: "manual",
      parentId: parentList.id,
    });

    const grandChildList = await ownerApi.lists.create({
      name: "GrandChild List",
      icon: "📝",
      type: "manual",
      parentId: childList.id,
    });

    // 2. Share parent list with collaborator as "viewer"
    await addAndAcceptCollaborator(
      ownerApi,
      collaboratorApi,
      parentList.id,
      "viewer",
    );

    // 3. Run calculateSubtreeEffectivePermissions
    const result = await List.calculateSubtreeEffectivePermissions(
      { db },
      parentList.id,
    );

    // Verify subtree list IDs
    expect(result.subtreeListIds).toContain(parentList.id);
    expect(result.subtreeListIds).toContain(childList.id);
    expect(result.subtreeListIds).toContain(grandChildList.id);

    // Verify candidateUserIds collected before BFS
    expect(result.candidateUserIds.has(collaboratorId)).toBe(true);

    // Verify directCollabMap
    const directKey = `${collaboratorId}:${parentList.id}`;
    expect(result.directCollabMap.has(directKey)).toBe(true);
    expect(result.directCollabMap.get(directKey)?.role).toBe("viewer");
    expect(
      result.directCollabMap.has(`${collaboratorId}:${childList.id}`),
    ).toBe(false);

    // Verify inheritedCollabMap records inherited permissions and sources
    const inheritedChildKey = `${collaboratorId}:${childList.id}`;
    const inheritedGrandChildKey = `${collaboratorId}:${grandChildList.id}`;
    expect(result.inheritedCollabMap.has(inheritedChildKey)).toBe(true);
    expect(result.inheritedCollabMap.get(inheritedChildKey)).toMatchObject({
      listId: childList.id,
      userId: collaboratorId,
      role: "viewer",
      sourceListId: parentList.id,
    });

    expect(result.inheritedCollabMap.has(inheritedGrandChildKey)).toBe(true);
    expect(result.inheritedCollabMap.get(inheritedGrandChildKey)).toMatchObject({
      listId: grandChildList.id,
      userId: collaboratorId,
      role: "viewer",
      sourceListId: parentList.id,
    });

    // Verify final merged effectivePermissionsMap
    const effectiveParent = result.effectivePermissionsMap.get(directKey);
    expect(effectiveParent).toMatchObject({
      role: "viewer",
      source: "direct",
    });

    const effectiveChild =
      result.effectivePermissionsMap.get(inheritedChildKey);
    expect(effectiveChild).toMatchObject({
      role: "viewer",
      source: "inherited",
      sourceListId: parentList.id,
    });

    const effectiveGrandChild = result.effectivePermissionsMap.get(
      inheritedGrandChildKey,
    );
    expect(effectiveGrandChild).toMatchObject({
      role: "viewer",
      source: "inherited",
      sourceListId: parentList.id,
    });
  });

  test<CustomTestContext>("should prioritize direct permissions over inherited permissions", async ({
    apiCallers,
    db,
  }) => {
    const ownerApi = apiCallers[0];
    const collaboratorApi = apiCallers[1];

    const collaboratorUser = await collaboratorApi.users.whoami();
    const collaboratorId = collaboratorUser.id;

    // Create 3-level hierarchy: Parent -> Child -> GrandChild
    const parentList = await ownerApi.lists.create({
      name: "Parent List",
      icon: "📁",
      type: "manual",
    });

    const childList = await ownerApi.lists.create({
      name: "Child List",
      icon: "📄",
      type: "manual",
      parentId: parentList.id,
    });

    const grandChildList = await ownerApi.lists.create({
      name: "GrandChild List",
      icon: "📝",
      type: "manual",
      parentId: childList.id,
    });

    // Share Parent as "editor"
    await addAndAcceptCollaborator(
      ownerApi,
      collaboratorApi,
      parentList.id,
      "editor",
    );

    // Directly share Child as "viewer"
    await addAndAcceptCollaborator(
      ownerApi,
      collaboratorApi,
      childList.id,
      "viewer",
    );

    const result = await List.calculateSubtreeEffectivePermissions(
      { db },
      parentList.id,
    );

    // Direct records should exist for both Parent and Child
    expect(
      result.directCollabMap.get(`${collaboratorId}:${parentList.id}`)?.role,
    ).toBe("editor");
    expect(
      result.directCollabMap.get(`${collaboratorId}:${childList.id}`)?.role,
    ).toBe("viewer");

    // Effective permission for Child must prioritize direct "viewer" over inherited "editor"
    const effectiveChild = result.effectivePermissionsMap.get(
      `${collaboratorId}:${childList.id}`,
    );
    expect(effectiveChild).toMatchObject({
      role: "viewer",
      source: "direct",
    });

    // GrandChild should inherit the updated "viewer" role from Child (proximity principle)
    const effectiveGrandChild = result.effectivePermissionsMap.get(
      `${collaboratorId}:${grandChildList.id}`,
    );
    expect(effectiveGrandChild).toMatchObject({
      role: "viewer",
      source: "inherited",
      sourceListId: childList.id,
    });
  });

  test<CustomTestContext>("should handle multiple candidate users across different levels", async ({
    apiCallers,
    db,
  }) => {
    const ownerApi = apiCallers[0];
    const userBApi = apiCallers[1];
    const userCApi = apiCallers[2];

    const userB = await userBApi.users.whoami();
    const userC = await userCApi.users.whoami();

    // Create hierarchy: Parent -> Child
    const parentList = await ownerApi.lists.create({
      name: "Team Root",
      icon: "🏢",
      type: "manual",
    });

    const childList = await ownerApi.lists.create({
      name: "Project Alpha",
      icon: "🚀",
      type: "manual",
      parentId: parentList.id,
    });

    // User B is added to Parent as "viewer"
    await addAndAcceptCollaborator(
      ownerApi,
      userBApi,
      parentList.id,
      "viewer",
    );

    // User C is added to Child as "editor"
    await addAndAcceptCollaborator(
      ownerApi,
      userCApi,
      childList.id,
      "editor",
    );

    const result = await List.calculateSubtreeEffectivePermissions(
      { db },
      parentList.id,
    );

    // Both User B and User C should be in candidateUserIds
    expect(result.candidateUserIds.has(userB.id)).toBe(true);
    expect(result.candidateUserIds.has(userC.id)).toBe(true);

    // User B has direct viewer on Parent, inherited viewer on Child
    expect(
      result.effectivePermissionsMap.get(`${userB.id}:${parentList.id}`),
    ).toMatchObject({
      role: "viewer",
      source: "direct",
    });
    expect(
      result.effectivePermissionsMap.get(`${userB.id}:${childList.id}`),
    ).toMatchObject({
      role: "viewer",
      source: "inherited",
    });

    // User C has no permission on Parent, direct editor on Child
    expect(
      result.effectivePermissionsMap.has(`${userC.id}:${parentList.id}`),
    ).toBe(false);
    expect(
      result.effectivePermissionsMap.get(`${userC.id}:${childList.id}`),
    ).toMatchObject({
      role: "editor",
      source: "direct",
    });
  });

  describe("Granting and Enforcing Scoped Access (Step 2)", () => {
    test<CustomTestContext>("Step 2.2: should cap child invitation role to viewer if parent role is viewer", async ({
      apiCallers,
      db,
    }) => {
      const ownerApi = apiCallers[0];
      const collaboratorApi = apiCallers[1];

      const collaboratorUser = await collaboratorApi.users.whoami();

      // Parent List -> Child List
      const parentList = await ownerApi.lists.create({
        name: "Parent List",
        icon: "📁",
        type: "manual",
      });

      const childList = await ownerApi.lists.create({
        name: "Child List",
        icon: "📄",
        type: "manual",
        parentId: parentList.id,
      });

      // Share Parent as viewer
      await addAndAcceptCollaborator(
        ownerApi,
        collaboratorApi,
        parentList.id,
        "viewer",
      );

      // Attempt to invite collaborator to Child as "editor"
      const { invitationId } = await ownerApi.lists.addCollaborator({
        listId: childList.id,
        email: collaboratorUser.email!,
        role: "editor",
      });

      // Accept invitation
      await collaboratorApi.lists.acceptInvitation({ invitationId });

      // Verify that the child list permission was capped to "viewer"
      const subtreeRes = await List.calculateSubtreeEffectivePermissions(
        { db },
        parentList.id,
      );
      const childPerm = subtreeRes.directCollabMap.get(
        `${collaboratorUser.id}:${childList.id}`,
      );
      expect(childPerm?.role).toBe("viewer");
    });

    test<CustomTestContext>("Step 2.3: should cascade downgrade child permissions when parent role is downgraded to viewer", async ({
      apiCallers,
      db,
    }) => {
      const ownerApi = apiCallers[0];
      const collaboratorApi = apiCallers[1];

      const collaboratorUser = await collaboratorApi.users.whoami();

      // Parent List -> Child List
      const parentList = await ownerApi.lists.create({
        name: "Parent List",
        icon: "📁",
        type: "manual",
      });

      const childList = await ownerApi.lists.create({
        name: "Child List",
        icon: "📄",
        type: "manual",
        parentId: parentList.id,
      });

      // Both Parent and Child are initially shared as "editor"
      await addAndAcceptCollaborator(
        ownerApi,
        collaboratorApi,
        parentList.id,
        "editor",
      );
      await addAndAcceptCollaborator(
        ownerApi,
        collaboratorApi,
        childList.id,
        "editor",
      );

      // Verify child is initially editor
      let subtreeRes = await List.calculateSubtreeEffectivePermissions(
        { db },
        parentList.id,
      );
      expect(
        subtreeRes.directCollabMap.get(
          `${collaboratorUser.id}:${childList.id}`,
        )?.role,
      ).toBe("editor");

      // Downgrade Parent to "viewer"
      await ownerApi.lists.updateCollaboratorRole({
        listId: parentList.id,
        userId: collaboratorUser.id,
        role: "viewer",
      });

      // Child list direct record should be cascaded to "viewer"
      subtreeRes = await List.calculateSubtreeEffectivePermissions(
        { db },
        parentList.id,
      );
      expect(
        subtreeRes.directCollabMap.get(
          `${collaboratorUser.id}:${parentList.id}`,
        )?.role,
      ).toBe("viewer");
      expect(
        subtreeRes.directCollabMap.get(
          `${collaboratorUser.id}:${childList.id}`,
        )?.role,
      ).toBe("viewer");
    });

    test<CustomTestContext>("Step 2.4: should cascade remove collaborator across entire subtree", async ({
      apiCallers,
      db,
    }) => {
      const ownerApi = apiCallers[0];
      const collaboratorApi = apiCallers[1];

      const collaboratorUser = await collaboratorApi.users.whoami();

      // Parent List -> Child List
      const parentList = await ownerApi.lists.create({
        name: "Parent List",
        icon: "📁",
        type: "manual",
      });

      const childList = await ownerApi.lists.create({
        name: "Child List",
        icon: "📄",
        type: "manual",
        parentId: parentList.id,
      });

      // Add collaborator to both Parent and Child
      await addAndAcceptCollaborator(
        ownerApi,
        collaboratorApi,
        parentList.id,
        "viewer",
      );
      await addAndAcceptCollaborator(
        ownerApi,
        collaboratorApi,
        childList.id,
        "viewer",
      );

      // Remove collaborator from Parent with cascading removal
      await ownerApi.lists.removeCollaborator({
        listId: parentList.id,
        userId: collaboratorUser.id,
      });

      // Both Parent and Child direct records must be removed
      const subtreeRes = await List.calculateSubtreeEffectivePermissions(
        { db },
        parentList.id,
      );
      expect(
        subtreeRes.directCollabMap.has(
          `${collaboratorUser.id}:${parentList.id}`,
        ),
      ).toBe(false);
      expect(
        subtreeRes.directCollabMap.has(
          `${collaboratorUser.id}:${childList.id}`,
        ),
      ).toBe(false);
      expect(
        subtreeRes.effectivePermissionsMap.has(
          `${collaboratorUser.id}:${parentList.id}`,
        ),
      ).toBe(false);
      expect(
        subtreeRes.effectivePermissionsMap.has(
          `${collaboratorUser.id}:${childList.id}`,
        ),
      ).toBe(false);
    });
  });
});
