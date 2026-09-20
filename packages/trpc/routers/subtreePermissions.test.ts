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

    // Share Parent as "viewer"
    await addAndAcceptCollaborator(
      ownerApi,
      collaboratorApi,
      parentList.id,
      "viewer",
    );

    // Directly share Child as "editor"
    await addAndAcceptCollaborator(
      ownerApi,
      collaboratorApi,
      childList.id,
      "editor",
    );

    const result = await List.calculateSubtreeEffectivePermissions(
      { db },
      parentList.id,
    );

    // Direct records should exist for both Parent and Child
    expect(
      result.directCollabMap.get(`${collaboratorId}:${parentList.id}`)?.role,
    ).toBe("viewer");
    expect(
      result.directCollabMap.get(`${collaboratorId}:${childList.id}`)?.role,
    ).toBe("editor");

    // Effective permission for Child must prioritize direct "editor" over inherited "viewer"
    const effectiveChild = result.effectivePermissionsMap.get(
      `${collaboratorId}:${childList.id}`,
    );
    expect(effectiveChild).toMatchObject({
      role: "editor",
      source: "direct",
    });

    // GrandChild should inherit the updated "editor" role from Child (proximity principle)
    const effectiveGrandChild = result.effectivePermissionsMap.get(
      `${collaboratorId}:${grandChildList.id}`,
    );
    expect(effectiveGrandChild).toMatchObject({
      role: "editor",
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
});
