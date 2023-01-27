module.exports = {
  enums: [
    {
      name: "permission",
      values: [
        {
          name: "basespot_delete",
          dbName: "basespot:delete"
        },
        {
          name: "basespot_create",
          dbName: "basespot:create"
        },
        {
          name: "basespot_update",
          dbName: "basespot:update"
        },
        {
          name: "basespot_view",
          dbName: "basespot:view"
        },
        {
          name: "role_create",
          dbName: "role:create"
        },
        {
          name: "role_update",
          dbName: "role:update"
        },
        {
          name: "role_delete",
          dbName: "role:delete"
        },
        {
          name: "user_create",
          dbName: "user:create"
        },
        {
          name: "user_update",
          dbName: "user:update"
        },
        {
          name: "user_delete",
          dbName: "user:delete"
        },
        {
          name: "tribe_create",
          dbName: "tribe:create"
        },
        {
          name: "tribe_update",
          dbName: "tribe:update"
        },
        {
          name: "tribe_delete",
          dbName: "tribe:delete"
        },
        {
          name: "timeline_create",
          dbName: "timeline:create"
        },
        {
          name: "timeline_update",
          dbName: "timeline:update"
        },
        {
          name: "timeline_delete",
          dbName: "timeline:delete"
        }
      ],
      dbName: null
    },
    {
      name: "user_status",
      values: [
        {
          name: "ONLINE",
          dbName: null
        },
        {
          name: "OFFLINE",
          dbName: null
        }
      ],
      dbName: null
    }
  ],
  models: [
    {
      name: "TimelineBasespot",
      dbName: null,
      fields: [
        {
          name: "id",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: true,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "BigInt",
          default: {
            name: "autoincrement",
            args: []
          },
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "created_at",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "DateTime",
          default: {
            name: "now",
            args: []
          },
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "updated_at",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "DateTime",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "timeline_id",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: true,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "startDate",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "DateTime",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "endDate",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "DateTime",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "basespot_id",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: true,
          hasDefaultValue: false,
          type: "BigInt",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "tribeName",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "map",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "server",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "region",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "season",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "cluster",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "location",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Json",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "players",
          kind: "scalar",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "created_by",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "raided_by",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "raidcomment",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "basespot",
          kind: "object",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Basespot",
          relationName: "BasespotToTimelineBasespot",
          relationFromFields: [
            "basespot_id"
          ],
          relationToFields: [
            "id"
          ],
          relationOnDelete: "NoAction",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "timeline",
          kind: "object",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Timeline",
          relationName: "TimelineToTimelineBasespot",
          relationFromFields: [
            "timeline_id"
          ],
          relationToFields: [
            "id"
          ],
          relationOnDelete: "NoAction",
          isGenerated: false,
          isUpdatedAt: false
        }
      ],
      primaryKey: null,
      uniqueFields: [],
      uniqueIndexes: [],
      isGenerated: false
    },
    {
      name: "Basespot",
      dbName: null,
      fields: [
        {
          name: "id",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: true,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "BigInt",
          default: {
            name: "autoincrement",
            args: []
          },
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "name",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "description",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "latitude",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Float",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "longitude",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Float",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "image",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "created_at",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "DateTime",
          default: {
            name: "now",
            args: []
          },
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "Map",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "String",
          default: "TheIsland",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "estimatedForPlayers",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "String",
          default: "0",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "defenseImages",
          kind: "scalar",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "created_by",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "turretsetup_image",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "updated_at",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "DateTime",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "TimelineBasespot",
          kind: "object",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "TimelineBasespot",
          relationName: "BasespotToTimelineBasespot",
          relationFromFields: [],
          relationToFields: [],
          isGenerated: false,
          isUpdatedAt: false
        }
      ],
      primaryKey: null,
      uniqueFields: [],
      uniqueIndexes: [],
      isGenerated: false
    },
    {
      name: "Profile",
      dbName: null,
      fields: [
        {
          name: "id",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: true,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "updated_at",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "DateTime",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "username",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: true,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "full_name",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "avatar_url",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "website",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "biography",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "status",
          kind: "enum",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "user_status",
          default: "OFFLINE",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "role_id",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: true,
          hasDefaultValue: true,
          type: "String",
          default: {
            name: "dbgenerated",
            args: [
              "'697b7d70-bab3-4ff9-9c3e-f30b058b621c'::uuid"
            ]
          },
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "created_at",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "DateTime",
          default: {
            name: "now",
            args: []
          },
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "Message",
          kind: "object",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Message",
          relationName: "MessageToProfile",
          relationFromFields: [],
          relationToFields: [],
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "role_profile_role_idTorole",
          kind: "object",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Role",
          relationName: "profile_role_idTorole",
          relationFromFields: [
            "role_id"
          ],
          relationToFields: [
            "id"
          ],
          relationOnDelete: "NoAction",
          isGenerated: false,
          isUpdatedAt: false
        }
      ],
      primaryKey: null,
      uniqueFields: [],
      uniqueIndexes: [],
      isGenerated: false
    },
    {
      name: "Role",
      dbName: null,
      fields: [
        {
          name: "id",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: true,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "String",
          default: {
            name: "dbgenerated",
            args: [
              "extensions.uuid_generate_v4()"
            ]
          },
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "name",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "createdBy",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "String",
          default: {
            name: "dbgenerated",
            args: [
              "auth.uid()"
            ]
          },
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "permissions",
          kind: "enum",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "permission",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "profile_profile_role_idTorole",
          kind: "object",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Profile",
          relationName: "profile_role_idTorole",
          relationFromFields: [],
          relationToFields: [],
          isGenerated: false,
          isUpdatedAt: false
        }
      ],
      primaryKey: null,
      uniqueFields: [],
      uniqueIndexes: [],
      isGenerated: false
    },
    {
      name: "Timeline",
      dbName: null,
      fields: [
        {
          name: "id",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: true,
          isId: true,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "String",
          default: {
            name: "dbgenerated",
            args: [
              "extensions.uuid_generate_v4()"
            ]
          },
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "createdAt",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "DateTime",
          default: {
            name: "now",
            args: []
          },
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "updatedAt",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "DateTime",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "createdBy",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "TimelineBasespot",
          kind: "object",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "TimelineBasespot",
          relationName: "TimelineToTimelineBasespot",
          relationFromFields: [],
          relationToFields: [],
          isGenerated: false,
          isUpdatedAt: false
        }
      ],
      primaryKey: null,
      uniqueFields: [],
      uniqueIndexes: [],
      isGenerated: false
    },
    {
      name: "Tribe",
      dbName: null,
      fields: [
        {
          name: "id",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: true,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Int",
          default: {
            name: "autoincrement",
            args: []
          },
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "name",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "description",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "created_at",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "DateTime",
          default: {
            name: "now",
            args: []
          },
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "updated_at",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "DateTime",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "createdBy",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "updatedBy",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        }
      ],
      primaryKey: null,
      uniqueFields: [],
      uniqueIndexes: [],
      isGenerated: false
    },
    {
      name: "Message",
      dbName: null,
      fields: [
        {
          name: "id",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: true,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "String",
          default: {
            name: "dbgenerated",
            args: [
              "extensions.uuid_generate_v4()"
            ]
          },
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "profile_id",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: true,
          hasDefaultValue: true,
          type: "String",
          default: {
            name: "dbgenerated",
            args: [
              "auth.uid()"
            ]
          },
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "content",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "created_at",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "DateTime",
          default: {
            name: "dbgenerated",
            args: [
              "timezone('utc'::text, now())"
            ]
          },
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "Profile",
          kind: "object",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Profile",
          relationName: "MessageToProfile",
          relationFromFields: [
            "profile_id"
          ],
          relationToFields: [
            "id"
          ],
          relationOnDelete: "Cascade",
          isGenerated: false,
          isUpdatedAt: false
        }
      ],
      primaryKey: null,
      uniqueFields: [],
      uniqueIndexes: [],
      isGenerated: false
    }
  ],
  types: []
};