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
        },
        {
          name: "gamedata_delete",
          dbName: "gamedata:delete"
        },
        {
          name: "gamedata_update",
          dbName: "gamedata:update"
        },
        {
          name: "gamedata_create",
          dbName: "gamedata:create"
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
    },
    {
      name: "dinostattype",
      values: [
        {
          name: "food",
          dbName: null
        },
        {
          name: "gather_efficiency",
          dbName: null
        },
        {
          name: "weight_reduction",
          dbName: null
        },
        {
          name: "immobilized_by",
          dbName: null
        },
        {
          name: "fits_through",
          dbName: null
        },
        {
          name: "drops",
          dbName: null
        },
        {
          name: "saddle",
          dbName: null
        },
        {
          name: "bossrecipe",
          dbName: null
        },
        {
          name: "engrams",
          dbName: null
        }
      ],
      dbName: null
    }
  ],
  models: [
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
          type: "String",
          default: {
            name: "dbgenerated",
            args: [
              "gen_random_uuid()"
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
          name: "updated_at",
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
          name: "created_by",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: true,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "updated_by",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: true,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "name",
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
          name: "map_id",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: true,
          hasDefaultValue: false,
          type: "BigInt",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "thumbnail",
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
          name: "turretsetup_images",
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
          name: "published",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Boolean",
          default: true,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "level",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "String",
          default: "",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "estimated_for_players",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "String",
          default: "1",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "type",
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
          name: "base_images",
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
          name: "has_air",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Boolean",
          default: true,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "Profile",
          kind: "object",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Profile",
          relationName: "BasespotToProfile",
          relationFromFields: [
            "created_by"
          ],
          relationToFields: [
            "id"
          ],
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "Map",
          kind: "object",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Map",
          relationName: "BasespotToMap",
          relationFromFields: [
            "map_id"
          ],
          relationToFields: [
            "id"
          ],
          relationOnDelete: "NoAction",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "Profile_Basespot_updated_byToProfile",
          kind: "object",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Profile",
          relationName: "Basespot_updated_byToProfile",
          relationFromFields: [
            "updated_by"
          ],
          relationToFields: [
            "id"
          ],
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "TimelineSeasonBasespot",
          kind: "object",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "TimelineSeasonBasespot",
          relationName: "BasespotToTimelineSeasonBasespot",
          relationFromFields: [],
          relationToFields: [],
          isGenerated: false,
          isUpdatedAt: false
        }
      ],
      primaryKey: null,
      uniqueFields: [
        [
          "latitude",
          "longitude",
          "map_id"
        ]
      ],
      uniqueIndexes: [
        {
          name: null,
          fields: [
            "latitude",
            "longitude",
            "map_id"
          ]
        }
      ],
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
          hasDefaultValue: true,
          type: "String",
          default: {
            name: "dbgenerated",
            args: [
              "gen_random_uuid()"
            ]
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
          name: "steam_user_id",
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
          name: "banned_until",
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
          name: "email",
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
          name: "Basespot",
          kind: "object",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Basespot",
          relationName: "BasespotToProfile",
          relationFromFields: [],
          relationToFields: [],
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "Basespot_Basespot_updated_byToProfile",
          kind: "object",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Basespot",
          relationName: "Basespot_updated_byToProfile",
          relationFromFields: [],
          relationToFields: [],
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
        },
        {
          name: "Role_Role_created_byToProfile",
          kind: "object",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Role",
          relationName: "Role_created_byToProfile",
          relationFromFields: [],
          relationToFields: [],
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "TimelineSeason",
          kind: "object",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "TimelineSeason",
          relationName: "ProfileToTimelineSeason",
          relationFromFields: [],
          relationToFields: [],
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "TimelineSeasonBasespot",
          kind: "object",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "TimelineSeasonBasespot",
          relationName: "ProfileToTimelineSeasonBasespot",
          relationFromFields: [],
          relationToFields: [],
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "TimelineSeasonEvent",
          kind: "object",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "TimelineSeasonEvent",
          relationName: "ProfileToTimelineSeasonEvent",
          relationFromFields: [],
          relationToFields: [],
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "TimelineSeasonEvent_TimelineSeasonEvent_updated_byToProfile",
          kind: "object",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "TimelineSeasonEvent",
          relationName: "TimelineSeasonEvent_updated_byToProfile",
          relationFromFields: [],
          relationToFields: [],
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "TimelineSeasonPerson",
          kind: "object",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "TimelineSeasonPerson",
          relationName: "ProfileToTimelineSeasonPerson",
          relationFromFields: [],
          relationToFields: [],
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "Tribe",
          kind: "object",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Tribe",
          relationName: "ProfileToTribe",
          relationFromFields: [],
          relationToFields: [],
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "UserRecipe",
          kind: "object",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "UserRecipe",
          relationName: "ProfileToUserRecipe",
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
              "uuid_generate_v4()"
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
          name: "created_by",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: true,
          hasDefaultValue: false,
          type: "String",
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
        },
        {
          name: "Profile_Role_created_byToProfile",
          kind: "object",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Profile",
          relationName: "Role_created_byToProfile",
          relationFromFields: [
            "created_by"
          ],
          relationToFields: [
            "id"
          ],
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
          type: "String",
          default: {
            name: "dbgenerated",
            args: [
              "gen_random_uuid()"
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
          name: "updated_at",
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
          name: "created_by",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: true,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "Profile",
          kind: "object",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Profile",
          relationName: "ProfileToTribe",
          relationFromFields: [
            "created_by"
          ],
          relationToFields: [
            "id"
          ],
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
              "uuid_generate_v4()"
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
          hasDefaultValue: false,
          type: "String",
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
          isRequired: false,
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
    },
    {
      name: "Dino",
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
              "uuid_generate_v4()"
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
          name: "synonyms",
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
          name: "taming_notice",
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
          name: "can_destroy",
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
          name: "base_stats",
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
          name: "exp_per_kill",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Float",
          default: 0,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "egg_min",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Float",
          default: 0,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "egg_max",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Float",
          default: 0,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "tdps",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Float",
          default: 0,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "maturation_time",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Float",
          default: 0,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "incubation_time",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Float",
          default: 0,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "affinity_needed",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Float",
          default: 0,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "aff_inc",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Float",
          default: 0,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "flee_threshold",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Float",
          default: 0,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "hitboxes",
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
          name: "food_consumption_base",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Float",
          default: 0,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "food_consumption_mult",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Float",
          default: 0,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "disable_ko",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Boolean",
          default: false,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "violent_tame",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Boolean",
          default: false,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "taming_ineffectiveness",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Float",
          default: 0,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "disable_food",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Boolean",
          default: false,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "disable_mult",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Boolean",
          default: false,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "admin_note",
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
          name: "base_points",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Float",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "non_violent_food_affinity_mult",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Float",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "non_violent_food_rate_mult",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Float",
          default: 0,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "taming_interval",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Float",
          default: 0,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "base_taming_time",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Float",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "disable_tame",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Boolean",
          default: false,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "x_variant",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Boolean",
          default: false,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "attack",
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
          name: "mounted_weaponry",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Boolean",
          default: false,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "ridable",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Boolean",
          default: false,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "movement",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Json",
          default: "null",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "type",
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
          name: "carryable_by",
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
          name: "icon",
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
          name: "multipliers",
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
          name: "baby_food_consumption_mult",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Float",
          default: 0,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "gestation_time",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Float",
          default: 0,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "mating_cooldown_min",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "BigInt",
          default: "0",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "mating_cooldown_max",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "BigInt",
          default: "0",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "temperament",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "String",
          default: "Passive",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "diet",
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
          name: "released",
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
          name: "tamable",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Boolean",
          default: true,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "breedable",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Boolean",
          default: true,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "bp",
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
          name: "default_dmg",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Float",
          default: 0,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "default_swing_radius",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Float",
          default: 0,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "targeting_team_name",
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
          name: "flags",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Json",
          default: "[]",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "DinoStat",
          kind: "object",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "DinoStat",
          relationName: "DinoToDinoStat",
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
      name: "Item",
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
          name: "max_stack",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Float",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "weight",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Float",
          default: 0,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "engram_points",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Float",
          default: 0,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "stats",
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
          name: "color",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "String",
          default: "#ff0000",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "type",
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
          name: "category",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "String",
          default: "'Other'::text",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "health",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Float",
          default: 0,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "food",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Float",
          default: 0,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "torpor",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Float",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "visible",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Boolean",
          default: true,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "affinity",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Float",
          default: 0,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "torpor_duration",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Float",
          default: 0,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "damage",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Float",
          default: 0,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "blueprint",
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
          name: "DinoStat",
          kind: "object",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "DinoStat",
          relationName: "DinoStatToItem",
          relationFromFields: [],
          relationToFields: [],
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "ItemRecipe_ItemRecipe_crafted_item_idToItem",
          kind: "object",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "ItemRecipe",
          relationName: "ItemRecipe_crafted_item_idToItem",
          relationFromFields: [],
          relationToFields: [],
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "ItemRecipe_ItemRecipe_crafting_station_idToItem",
          kind: "object",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "ItemRecipe",
          relationName: "ItemRecipe_crafting_station_idToItem",
          relationFromFields: [],
          relationToFields: [],
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "ItemRecipeItem",
          kind: "object",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "ItemRecipeItem",
          relationName: "ItemToItemRecipeItem",
          relationFromFields: [],
          relationToFields: [],
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "LootcrateItem",
          kind: "object",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "LootcrateItem",
          relationName: "ItemToLootcrateItem",
          relationFromFields: [],
          relationToFields: [],
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "MapResource",
          kind: "object",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "MapResource",
          relationName: "ItemToMapResource",
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
      name: "Map",
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
          name: "name",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: true,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "img",
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
          name: "icon",
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
          name: "release_date",
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
          name: "parent_map_id",
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
          name: "topographic_img",
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
          name: "boundaries",
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
          name: "cord_shift_lat",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Float",
          default: 50,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "cord_shift_lon",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Float",
          default: 50,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "cord_mult_lat",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Float",
          default: 8e3,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "cord_mult_lon",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Float",
          default: 8e3,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "Basespot",
          kind: "object",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Basespot",
          relationName: "BasespotToMap",
          relationFromFields: [],
          relationToFields: [],
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "LootcrateMap",
          kind: "object",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "LootcrateMap",
          relationName: "LootcrateMapToMap",
          relationFromFields: [],
          relationToFields: [],
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "Map",
          kind: "object",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Map",
          relationName: "MapToMap",
          relationFromFields: [
            "parent_map_id"
          ],
          relationToFields: [
            "id"
          ],
          relationOnDelete: "NoAction",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "other_Map",
          kind: "object",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Map",
          relationName: "MapToMap",
          relationFromFields: [],
          relationToFields: [],
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "MapNote",
          kind: "object",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "MapNote",
          relationName: "MapToMapNote",
          relationFromFields: [],
          relationToFields: [],
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "MapRegion",
          kind: "object",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "MapRegion",
          relationName: "MapToMapRegion",
          relationFromFields: [],
          relationToFields: [],
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "MapResource",
          kind: "object",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "MapResource",
          relationName: "MapToMapResource",
          relationFromFields: [],
          relationToFields: [],
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "TimelineSeasonBasespot",
          kind: "object",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "TimelineSeasonBasespot",
          relationName: "MapToTimelineSeasonBasespot",
          relationFromFields: [],
          relationToFields: [],
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "TimelineSeasonEvent",
          kind: "object",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "TimelineSeasonEvent",
          relationName: "MapToTimelineSeasonEvent",
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
      name: "Lootcrate",
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
          name: "updated_at",
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
          name: "blueprint",
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
          name: "required_level",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "BigInt",
          default: "0",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "quality_mult",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Json",
          default: '{"max": 0, "min": 0, "pow": 0}',
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "set_qty",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Json",
          default: '{"max": 0, "min": 0, "pow": 0}',
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "repeat_in_sets",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Boolean",
          default: false,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "color",
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
          name: "type",
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
          name: "LootcrateItem",
          kind: "object",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "LootcrateItem",
          relationName: "LootcrateToLootcrateItem",
          relationFromFields: [],
          relationToFields: [],
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "LootcrateMap",
          kind: "object",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "LootcrateMap",
          relationName: "LootcrateToLootcrateMap",
          relationFromFields: [],
          relationToFields: [],
          isGenerated: false,
          isUpdatedAt: false
        }
      ],
      primaryKey: null,
      uniqueFields: [
        [
          "name",
          "blueprint"
        ]
      ],
      uniqueIndexes: [
        {
          name: null,
          fields: [
            "name",
            "blueprint"
          ]
        }
      ],
      isGenerated: false
    },
    {
      name: "DinoStat",
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
              "uuid_generate_v4()"
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
          name: "updated_at",
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
          name: "dino_id",
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
          name: "item_id",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: true,
          hasDefaultValue: false,
          type: "BigInt",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "value",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Float",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "rank",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "BigInt",
          default: "0",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "type",
          kind: "enum",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "dinostattype",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "Dino",
          kind: "object",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Dino",
          relationName: "DinoToDinoStat",
          relationFromFields: [
            "dino_id"
          ],
          relationToFields: [
            "id"
          ],
          relationOnDelete: "Cascade",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "Item",
          kind: "object",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Item",
          relationName: "DinoStatToItem",
          relationFromFields: [
            "item_id"
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
      uniqueFields: [
        [
          "dino_id",
          "item_id",
          "type"
        ]
      ],
      uniqueIndexes: [
        {
          name: null,
          fields: [
            "dino_id",
            "item_id",
            "type"
          ]
        }
      ],
      isGenerated: false
    },
    {
      name: "MapNote",
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
              "uuid_generate_v4()"
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
          name: "updated_at",
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
          name: "map_id",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: true,
          hasDefaultValue: false,
          type: "BigInt",
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
          hasDefaultValue: true,
          type: "Float",
          default: 0,
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
          hasDefaultValue: true,
          type: "Float",
          default: 0,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "x",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Float",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "y",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Float",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "z",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Float",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "note_index",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "BigInt",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "Map",
          kind: "object",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Map",
          relationName: "MapToMapNote",
          relationFromFields: [
            "map_id"
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
      name: "ItemRecipeItem",
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
              "gen_random_uuid()"
            ]
          },
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
          name: "updated_at",
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
          name: "item_recipe_id",
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
          name: "item_id",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: true,
          hasDefaultValue: false,
          type: "BigInt",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "amount",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Float",
          default: 1,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "Item",
          kind: "object",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Item",
          relationName: "ItemToItemRecipeItem",
          relationFromFields: [
            "item_id"
          ],
          relationToFields: [
            "id"
          ],
          relationOnDelete: "NoAction",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "ItemRecipe",
          kind: "object",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "ItemRecipe",
          relationName: "ItemRecipeToItemRecipeItem",
          relationFromFields: [
            "item_recipe_id"
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
      uniqueFields: [
        [
          "item_id",
          "item_recipe_id"
        ]
      ],
      uniqueIndexes: [
        {
          name: null,
          fields: [
            "item_id",
            "item_recipe_id"
          ]
        }
      ],
      isGenerated: false,
      documentation: "This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments\nThis model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info."
    },
    {
      name: "UserRecipe",
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
              "gen_random_uuid()"
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
          name: "user_id",
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
          name: "private",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Boolean",
          default: true,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "name",
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
          name: "Profile",
          kind: "object",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Profile",
          relationName: "ProfileToUserRecipe",
          relationFromFields: [
            "user_id"
          ],
          relationToFields: [
            "id"
          ],
          relationOnDelete: "SetNull",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "UserRecipeItemRecipe",
          kind: "object",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "UserRecipeItemRecipe",
          relationName: "UserRecipeToUserRecipeItemRecipe",
          relationFromFields: [],
          relationToFields: [],
          isGenerated: false,
          isUpdatedAt: false
        }
      ],
      primaryKey: null,
      uniqueFields: [],
      uniqueIndexes: [],
      isGenerated: false,
      documentation: "This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments\nThis model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info."
    },
    {
      name: "UserRecipeItemRecipe",
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
              "gen_random_uuid()"
            ]
          },
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
          name: "user_recipe_id",
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
          name: "item_recipe_id",
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
          name: "amount",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "BigInt",
          default: "1",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "ItemRecipe",
          kind: "object",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "ItemRecipe",
          relationName: "ItemRecipeToUserRecipeItemRecipe",
          relationFromFields: [
            "item_recipe_id"
          ],
          relationToFields: [
            "id"
          ],
          relationOnDelete: "NoAction",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "UserRecipe",
          kind: "object",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "UserRecipe",
          relationName: "UserRecipeToUserRecipeItemRecipe",
          relationFromFields: [
            "user_recipe_id"
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
      isGenerated: false,
      documentation: "This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info."
    },
    {
      name: "ItemRecipe",
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
              "gen_random_uuid()"
            ]
          },
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
          name: "updated_at",
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
          name: "crafted_item_id",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: true,
          hasDefaultValue: false,
          type: "BigInt",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "crafting_station_id",
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
          name: "crafting_time",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Float",
          default: 1,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "yields",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Float",
          default: 1,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "required_level",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "BigInt",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "Item_ItemRecipe_crafted_item_idToItem",
          kind: "object",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Item",
          relationName: "ItemRecipe_crafted_item_idToItem",
          relationFromFields: [
            "crafted_item_id"
          ],
          relationToFields: [
            "id"
          ],
          relationOnDelete: "NoAction",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "Item_ItemRecipe_crafting_station_idToItem",
          kind: "object",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Item",
          relationName: "ItemRecipe_crafting_station_idToItem",
          relationFromFields: [
            "crafting_station_id"
          ],
          relationToFields: [
            "id"
          ],
          relationOnDelete: "NoAction",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "ItemRecipeItem",
          kind: "object",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "ItemRecipeItem",
          relationName: "ItemRecipeToItemRecipeItem",
          relationFromFields: [],
          relationToFields: [],
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "UserRecipeItemRecipe",
          kind: "object",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "UserRecipeItemRecipe",
          relationName: "ItemRecipeToUserRecipeItemRecipe",
          relationFromFields: [],
          relationToFields: [],
          isGenerated: false,
          isUpdatedAt: false
        }
      ],
      primaryKey: null,
      uniqueFields: [
        [
          "crafted_item_id",
          "crafting_station_id"
        ]
      ],
      uniqueIndexes: [
        {
          name: null,
          fields: [
            "crafted_item_id",
            "crafting_station_id"
          ]
        }
      ],
      isGenerated: false,
      documentation: "This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments\nThis model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info."
    },
    {
      name: "TimelineSeason",
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
              "gen_random_uuid()"
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
          name: "tribe_name",
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
          name: "season_start_date",
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
          name: "season_end_date",
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
          name: "created_by",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: true,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "Profile",
          kind: "object",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Profile",
          relationName: "ProfileToTimelineSeason",
          relationFromFields: [
            "created_by"
          ],
          relationToFields: [
            "id"
          ],
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "TimelineSeasonBasespot",
          kind: "object",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "TimelineSeasonBasespot",
          relationName: "TimelineSeasonToTimelineSeasonBasespot",
          relationFromFields: [],
          relationToFields: [],
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "TimelineSeasonEvent",
          kind: "object",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "TimelineSeasonEvent",
          relationName: "TimelineSeasonToTimelineSeasonEvent",
          relationFromFields: [],
          relationToFields: [],
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "TimelineSeasonPerson",
          kind: "object",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "TimelineSeasonPerson",
          relationName: "TimelineSeasonToTimelineSeasonPerson",
          relationFromFields: [],
          relationToFields: [],
          isGenerated: false,
          isUpdatedAt: false
        }
      ],
      primaryKey: null,
      uniqueFields: [],
      uniqueIndexes: [],
      isGenerated: false,
      documentation: "This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments\nThis model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info."
    },
    {
      name: "TimelineSeasonEvent",
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
              "gen_random_uuid()"
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
          name: "timeline_season_id",
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
          name: "title",
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
          name: "content",
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
          name: "map_id",
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
          name: "latitude",
          kind: "scalar",
          isList: false,
          isRequired: false,
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
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Float",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "images",
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
          name: "created_by",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: true,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "tags",
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
          name: "updated_by",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: true,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "Profile",
          kind: "object",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Profile",
          relationName: "ProfileToTimelineSeasonEvent",
          relationFromFields: [
            "created_by"
          ],
          relationToFields: [
            "id"
          ],
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "Map",
          kind: "object",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Map",
          relationName: "MapToTimelineSeasonEvent",
          relationFromFields: [
            "map_id"
          ],
          relationToFields: [
            "id"
          ],
          relationOnDelete: "NoAction",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "TimelineSeason",
          kind: "object",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "TimelineSeason",
          relationName: "TimelineSeasonToTimelineSeasonEvent",
          relationFromFields: [
            "timeline_season_id"
          ],
          relationToFields: [
            "id"
          ],
          relationOnDelete: "NoAction",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "Profile_TimelineSeasonEvent_updated_byToProfile",
          kind: "object",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Profile",
          relationName: "TimelineSeasonEvent_updated_byToProfile",
          relationFromFields: [
            "updated_by"
          ],
          relationToFields: [
            "id"
          ],
          isGenerated: false,
          isUpdatedAt: false
        }
      ],
      primaryKey: null,
      uniqueFields: [],
      uniqueIndexes: [],
      isGenerated: false,
      documentation: "This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments\nThis model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info."
    },
    {
      name: "TimelineSeasonBasespot",
      dbName: null,
      fields: [
        {
          name: "id",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: true,
          isId: false,
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
          name: "start_date",
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
          name: "end_date",
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
          name: "map_id",
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
          name: "created_by",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: true,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "latitude",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Float",
          default: 0,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "longitude",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Float",
          default: 0,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "timeline_season_id",
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
          name: "basespot_id",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: true,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "Basespot",
          kind: "object",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Basespot",
          relationName: "BasespotToTimelineSeasonBasespot",
          relationFromFields: [
            "basespot_id"
          ],
          relationToFields: [
            "id"
          ],
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "Profile",
          kind: "object",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Profile",
          relationName: "ProfileToTimelineSeasonBasespot",
          relationFromFields: [
            "created_by"
          ],
          relationToFields: [
            "id"
          ],
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "Map",
          kind: "object",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Map",
          relationName: "MapToTimelineSeasonBasespot",
          relationFromFields: [
            "map_id"
          ],
          relationToFields: [
            "id"
          ],
          relationOnDelete: "NoAction",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "TimelineSeason",
          kind: "object",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "TimelineSeason",
          relationName: "TimelineSeasonToTimelineSeasonBasespot",
          relationFromFields: [
            "timeline_season_id"
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
      isGenerated: false,
      documentation: "This table contains check constraints and requires additional setup for migrations. Visit https://pris.ly/d/check-constraints for more info.\nThis model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments\nThis model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info."
    },
    {
      name: "TimelineSeasonPerson",
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
              "gen_random_uuid()"
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
          name: "user_id",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: true,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "ingame_name",
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
          name: "timeline_season_id",
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
          name: "permission",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "String",
          default: "'admin'",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "TimelineSeason",
          kind: "object",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "TimelineSeason",
          relationName: "TimelineSeasonToTimelineSeasonPerson",
          relationFromFields: [
            "timeline_season_id"
          ],
          relationToFields: [
            "id"
          ],
          relationOnDelete: "NoAction",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "Profile",
          kind: "object",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Profile",
          relationName: "ProfileToTimelineSeasonPerson",
          relationFromFields: [
            "user_id"
          ],
          relationToFields: [
            "id"
          ],
          isGenerated: false,
          isUpdatedAt: false
        }
      ],
      primaryKey: null,
      uniqueFields: [],
      uniqueIndexes: [],
      isGenerated: false,
      documentation: "This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments\nThis model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info."
    },
    {
      name: "MapResource",
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
          name: "updated_at",
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
          name: "map_id",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: true,
          hasDefaultValue: false,
          type: "BigInt",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "item_id",
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
          name: "latitude",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Float",
          default: 0,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "longitude",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Float",
          default: 0,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "type",
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
          name: "Item",
          kind: "object",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Item",
          relationName: "ItemToMapResource",
          relationFromFields: [
            "item_id"
          ],
          relationToFields: [
            "id"
          ],
          relationOnDelete: "NoAction",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "Map",
          kind: "object",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Map",
          relationName: "MapToMapResource",
          relationFromFields: [
            "map_id"
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
      uniqueFields: [
        [
          "latitude",
          "longitude",
          "map_id",
          "item_id",
          "type"
        ]
      ],
      uniqueIndexes: [
        {
          name: null,
          fields: [
            "latitude",
            "longitude",
            "map_id",
            "item_id",
            "type"
          ]
        }
      ],
      isGenerated: false,
      documentation: "This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments\nThis model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info."
    },
    {
      name: "LootcrateItem",
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
          name: "updated_at",
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
          name: "lootcrate_id",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: true,
          hasDefaultValue: false,
          type: "BigInt",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "item_id",
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
          name: "type",
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
          name: "set_name",
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
          name: "entry_name",
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
          name: "set_weight",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Float",
          default: 0,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "entry_weight",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Float",
          default: 0,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "set_qty_scale",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Json",
          default: '{"max": 0, "min": 0, "pow": 0}',
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "entry_qty",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Json",
          default: '{"max": 0, "min": 0, "pow": 0}',
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "entry_quality",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Json",
          default: '{"max": 0, "min": 0, "pow": 0}',
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "set_can_repeat_items",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Boolean",
          default: false,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "bp_chance",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Float",
          default: 0,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "Item",
          kind: "object",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Item",
          relationName: "ItemToLootcrateItem",
          relationFromFields: [
            "item_id"
          ],
          relationToFields: [
            "id"
          ],
          relationOnDelete: "NoAction",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "Lootcrate",
          kind: "object",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Lootcrate",
          relationName: "LootcrateToLootcrateItem",
          relationFromFields: [
            "lootcrate_id"
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
      isGenerated: false,
      documentation: "This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments\nThis model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info."
    },
    {
      name: "LootcrateMap",
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
          name: "updated_at",
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
          name: "lootcrate_id",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: true,
          hasDefaultValue: false,
          type: "BigInt",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "map_id",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: true,
          hasDefaultValue: false,
          type: "BigInt",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "positions",
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
          name: "Lootcrate",
          kind: "object",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Lootcrate",
          relationName: "LootcrateToLootcrateMap",
          relationFromFields: [
            "lootcrate_id"
          ],
          relationToFields: [
            "id"
          ],
          relationOnDelete: "NoAction",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "Map",
          kind: "object",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Map",
          relationName: "LootcrateMapToMap",
          relationFromFields: [
            "map_id"
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
      uniqueFields: [
        [
          "map_id",
          "lootcrate_id"
        ]
      ],
      uniqueIndexes: [
        {
          name: null,
          fields: [
            "map_id",
            "lootcrate_id"
          ]
        }
      ],
      isGenerated: false,
      documentation: "This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments\nThis model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info."
    },
    {
      name: "MapRegion",
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
          name: "name",
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
          name: "map_id",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: true,
          hasDefaultValue: false,
          type: "BigInt",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "wind",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Decimal",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "temperature",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Decimal",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "priority",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "BigInt",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "outside",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Boolean",
          default: true,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "start_x",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Decimal",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "start_y",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Decimal",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "start_z",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Decimal",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "end_x",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Decimal",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "end_y",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Decimal",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "end_z",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Decimal",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "radiation",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Boolean",
          default: false,
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "Map",
          kind: "object",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Map",
          relationName: "MapToMapRegion",
          relationFromFields: [
            "map_id"
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
      uniqueFields: [
        [
          "map_id",
          "start_x",
          "start_y",
          "start_z",
          "end_x",
          "end_y",
          "end_z"
        ]
      ],
      uniqueIndexes: [
        {
          name: null,
          fields: [
            "map_id",
            "start_x",
            "start_y",
            "start_z",
            "end_x",
            "end_y",
            "end_z"
          ]
        }
      ],
      isGenerated: false,
      documentation: "This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info."
    },
    {
      name: "item_recipes_view",
      dbName: null,
      fields: [
        {
          name: "id",
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
          name: "crafting_station_id",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "BigInt",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "crafting_time",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Float",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "yields",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Float",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "crafted_item_id",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "BigInt",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "crafted_item_name",
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
          name: "crafted_item_image",
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
          name: "crafted_item_category",
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
          name: "crafted_item_type",
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
          name: "item_recipe_item_id",
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
          name: "amount",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Float",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "item_id",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "BigInt",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "item_name",
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
          name: "item_image",
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
      isGenerated: false,
      documentation: "The underlying view does not contain a valid unique identifier and can therefore currently not be handled by the Prisma Client."
    },
    {
      name: "user_view",
      dbName: null,
      fields: [
        {
          name: "id",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: true,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "email",
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
          hasDefaultValue: false,
          type: "DateTime",
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
          name: "invited_at",
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
          name: "banned_until",
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
          name: "email_change_confirm_status",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Int",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "phone",
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
          name: "last_sign_in_at",
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
          name: "recovery_sent_at",
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
          name: "fullname",
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
          name: "username",
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
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "user_status",
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
          name: "role_id",
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
          name: "name",
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
      isGenerated: false,
      documentation: "The underlying view does not contain a valid unique identifier and can therefore currently not be handled by the Prisma Client."
    }
  ],
  types: []
};
