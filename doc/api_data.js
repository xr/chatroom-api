define({ "api": [  {    "type": "get",    "url": "/api/v1/auth/:name",    "title": "signIn",    "group": "Auth",    "permission": [      {        "name": "none"      }    ],    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "name",            "description": "<p>The provider name, i.e. facebook</p>"          }        ]      }    },    "description": "<p>signIn via different platforms.</p>",    "version": "0.0.0",    "filename": "./apis/v1/index.js",    "groupTitle": "Auth",    "name": "GetApiV1AuthName"  },  {    "type": "get",    "url": "/api/v1/messages",    "title": "getMessages",    "group": "Message",    "permission": [      {        "name": "authenticated"      }    ],    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "Number",            "optional": true,            "field": "page",            "defaultValue": "1",            "description": ""          },          {            "group": "Parameter",            "type": "Number",            "optional": true,            "field": "per_page",            "defaultValue": "10",            "description": ""          },          {            "group": "Parameter",            "type": "String",            "optional": true,            "field": "rid",            "description": "<p>room id</p>"          }        ]      }    },    "description": "<p>get a list of messages based on conditions.</p>",    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\n\t\"status\": \"success\"\n\t\"data\": {\n\t\t\"page\": 1,\n\t\t\"per_page\": 10,\n\t\t\"messages\": [\n\t\t\t...\n\t\t]\n\t}\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "./apis/v1/index.js",    "groupTitle": "Message",    "name": "GetApiV1Messages"  },  {    "type": "post",    "url": "/api/v1/messages",    "title": "createMessage",    "group": "Message",    "permission": [      {        "name": "authenticated"      }    ],    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "rid",            "description": "<p>The room id where the message will send to</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "content",            "description": "<p>The message content</p>"          }        ]      }    },    "description": "<p>send a message to one room</p>",    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "optional": false,            "field": "Unauthorized",            "description": "<p>Login required</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "BadRequest",            "description": "<p>Missing rid or content field</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "NotFound",            "description": "<p>The room where send message to does not exist</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "Forbidden",            "description": "<p>You do not have the right to post to the room</p>"          }        ]      }    },    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\n\t\"status\": \"success\",\n\t\"data\": {\n\t\tcontent: 'message content',\n\t\tfrom: '589a372779bf5d17cd9b9480',\n\t\trid: '5894d568d4f81c9d948aa20a',\n\t\t_id: '589a372879bf5d17cd9b9497',\n\t\tcreated: '2017-02-07T21:07:52.034Z'\n\t}\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "./apis/v1/index.js",    "groupTitle": "Message",    "name": "PostApiV1Messages"  },  {    "type": "put",    "url": "/api/v1/messages/:id",    "title": "updateMessage",    "group": "Message",    "permission": [      {        "name": "authenticated"      }    ],    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "id",            "description": "<p>The message id</p>"          }        ]      }    },    "description": "<p>update the message.</p>",    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "optional": false,            "field": "Unauthorized",            "description": "<p>Login required</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "BadRequest",            "description": "<p>Invalid message id.</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "NotFound",            "description": "<p>The message id not found</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "Forbidden",            "description": "<p>You do not have the right to update the message</p>"          }        ]      }    },    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\n\t\"status\": \"success\",\n\t\"data\": {\n\t\t\"_id\": \"589cd34f6e2da106678105ae\",\n\t\t\"content\": \"hello\",\n\t\t\"from\": \"589b78d0126f4d5825056055\",\n\t\t\"rid\": \"589b7a3187525658bc826301\",\n\t\t\"__v\": 0,\n\t\t\"created\": \"2017-02-09T20:38:39.678Z\",\n\t\t\"updated\": \"2017-02-09T20:38:39.678Z\"\n\t}\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "./apis/v1/index.js",    "groupTitle": "Message",    "name": "PutApiV1MessagesId"  },  {    "type": "get",    "url": "/api/v1/notifications",    "title": "getNotifications",    "group": "Notification",    "permission": [      {        "name": "authenticated"      }    ],    "description": "<p>get a list of notifications for the user.</p>",    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "optional": false,            "field": "Unauthorized",            "description": "<p>Login required</p>"          }        ]      }    },    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\n\t\"status\": \"success\"\n\t\"data\": [\n\t\t\"messages\": [\n\t\t\t{\n\t\t\t\t\"_id\": \"589cc29bc3f3de032a1293eb\",\n\t\t\t\t\"content\": \"content\",\n\t\t\t\t\"from\": {\n\t\t\t\t\t...\n\t\t\t\t},\n\t\t\t\t...\n\t\t\t\t\"to\": \"xxx\",\n\t\t\t\t...\n\t\t\t\t\"read\": 0\n\t\t\t}\n\t\t],\n\t\t\"room\": {\n\t\t\t...\n\t\t}\n\t]\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "./apis/v1/index.js",    "groupTitle": "Notification",    "name": "GetApiV1Notifications"  },  {    "type": "get",    "url": "/api/v1/rooms",    "title": "getRooms",    "group": "Room",    "permission": [      {        "name": "none"      }    ],    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "Number",            "optional": true,            "field": "page",            "defaultValue": "1",            "description": ""          },          {            "group": "Parameter",            "type": "Number",            "optional": true,            "field": "per_page",            "defaultValue": "10",            "description": ""          },          {            "group": "Parameter",            "type": "String",            "optional": true,            "field": "keywords",            "description": "<p>filter rooms that title contains keywords</p>"          }        ]      }    },    "description": "<p>get a list of rooms.</p>",    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\n\t\"status\": \"success\"\n\t\"data\": {\n\t\t\"page\": 1,\n\t\t\"per_page\": 10,\n\t\t\"rooms\": [\n\t\t\t{\n\t\t\t\t\"_id\": \"5895cd21bc62a4c4c18f0d4c\",\n\t\t\t\t\"title\": \"room title\",\n\t\t\t\t\"desc\": \"room description\",\n\t\t\t\t\"owner\": {\n\t\t\t\t\t...\n\t\t\t\t},\n\t\t\t\t\"updated\": \"2017-02-04T12:46:25.194Z\",\n\t\t\t\t\"created\": \"2017-02-04T12:46:25.194Z\",\n\t\t\t\t\"removed\": false,\n\t\t\t\t\"_links\": {\n\t\t\t\t\t\"self\": {\n\t\t\t\t\t\t\"href\": \"api/v1/rooms/5895cd21bc62a4c4c18f0d4c\"\n\t\t\t\t\t},\n\t\t\t\t\t\"messages\": {\n\t\t\t\t\t\t\"href\": \"api/v1/messages?rid=5895cd21bc62a4c4c18f0d4c\"\n\t\t\t\t\t}\n\t\t\t\t},\n\t\t\t\t\"id\": \"5895cd21bc62a4c4c18f0d4c\"\n\t\t\t\t}\n\t\t]\n\t}\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "./apis/v1/index.js",    "groupTitle": "Room",    "name": "GetApiV1Rooms"  },  {    "type": "get",    "url": "/api/v1/rooms/:id",    "title": "getRoom",    "group": "Room",    "permission": [      {        "name": "authenticated"      }    ],    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "id",            "description": "<p>room id</p>"          }        ]      }    },    "description": "<p>get details of one room.</p>",    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\n\t\"status\": \"success\"\n\t\"data\": {\n\t\t...\n\t}\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "./apis/v1/index.js",    "groupTitle": "Room",    "name": "GetApiV1RoomsId"  },  {    "type": "post",    "url": "/api/v1/rooms",    "title": "createRoom",    "group": "Room",    "permission": [      {        "name": "authenticated"      }    ],    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "title",            "description": "<p>The room title</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": true,            "field": "desc",            "description": "<p>The room description</p>"          }        ]      }    },    "description": "<p>create a new room.</p>",    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "optional": false,            "field": "Unauthorized",            "description": "<p>Login required</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "BadRequest",            "description": "<p>You must give a title</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "Conflict",            "description": "<p>Room name already exists</p>"          }        ]      }    },    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\n\t\"status\": \"success\",\n\t\"data\": {\n\t\t\"title\": \"title\",\n\t\t\"desc\": \"desc\",\n\t\t\"owner\": \"userid\",\n\t\t...\n\t}\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "./apis/v1/index.js",    "groupTitle": "Room",    "name": "PostApiV1Rooms"  },  {    "type": "put",    "url": "/api/v1/rooms/:id",    "title": "updateRoom",    "group": "Room",    "permission": [      {        "name": "authenticated/admin"      }    ],    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "id",            "description": "<p>The room id</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": true,            "field": "title",            "description": "<p>The room title</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": true,            "field": "logo",            "description": "<p>The room's logo</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": true,            "field": "desc",            "description": "<p>The room description</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": true,            "field": "uid",            "description": "<p>User id who joined the room</p>"          }        ]      }    },    "description": "<p>update the room information.</p>",    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "optional": false,            "field": "Unauthorized",            "description": "<p>Login required</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "BadRequest",            "description": "<p>Invalid room/user id</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "NotFound",            "description": "<p>Room/uid does not exist</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "Forbidden",            "description": "<p>You do not have right to modify this room</p>"          }        ]      }    },    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\n\t\"status\": \"success\",\n\t\"data\": {\n\t\t\"title\": \"title\",\n\t\t\"desc\": \"desc\",\n\t\t\"owner\": \"userid\",\n\t\t...\n\t}\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "./apis/v1/index.js",    "groupTitle": "Room",    "name": "PutApiV1RoomsId"  },  {    "type": "delete",    "url": "/api/v1/users/:id",    "title": "deleteUser",    "group": "User",    "permission": [      {        "name": "admin"      }    ],    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "id",            "description": "<p>The user id</p>"          }        ]      }    },    "description": "<p>delete one user</p>",    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "optional": false,            "field": "Unauthorized",            "description": "<p>Login required</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "BadRequest",            "description": "<p>Invalid user id</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "Forbidden",            "description": "<p>You do not have right to delete the user</p>"          }        ]      }    },    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\n\t\"status\": \"success\",\n\t\"data\": {\n\t\t...\n\t}\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "./apis/v1/index.js",    "groupTitle": "User",    "name": "DeleteApiV1UsersId"  },  {    "type": "get",    "url": "/api/v1/users",    "title": "getUsers",    "group": "User",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "Number",            "optional": true,            "field": "page",            "defaultValue": "1",            "description": ""          },          {            "group": "Parameter",            "type": "Number",            "optional": true,            "field": "per_page",            "defaultValue": "10",            "description": ""          }        ]      }    },    "permission": [      {        "name": "none"      }    ],    "description": "<p>get the users list</p>",    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\n\t\"status\": \"success\",\n\t\"data\": {\n\t\t\"page\": 1,\n\t\t\"per_page\": 10,\n\t\t\"users\": [{\n\t\t\t\"_id\": \"5895abc7b9556ac3aada3d4f\",\n\t\t\t\"fbid\": \"facebook id\",\n\t\t\t\"name\": \"name\",\n\t\t\t...\n\t\t}]\n\t}\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "./apis/v1/index.js",    "groupTitle": "User",    "name": "GetApiV1Users"  },  {    "type": "get",    "url": "/api/v1/users/:id",    "title": "getUser",    "group": "User",    "permission": [      {        "name": "none"      }    ],    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "id",            "description": "<p>The user id or 'me'</p>"          }        ]      }    },    "description": "<p>get the user details</p>",    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "optional": false,            "field": "BadRequest",            "description": "<p>Invalid user id</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "NotFound",            "description": "<p>User does not exist</p>"          }        ]      }    },    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\n\t\"status\": \"success\",\n\t\"data\": {\n\t\t\"_id\": \"5895abc7b9556ac3aada3d4f\",\n\t\t\"fbid\": \"facebook id\",\n\t\t\"name\": \"name\",\n\t\t...\n\t}\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "./apis/v1/index.js",    "groupTitle": "User",    "name": "GetApiV1UsersId"  },  {    "type": "put",    "url": "/api/v1/users/:id",    "title": "updateUser",    "group": "User",    "permission": [      {        "name": "authenticated/admin"      }    ],    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "id",            "description": "<p>The user id</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": true,            "field": "signature",            "description": "<p>The user signature</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": true,            "field": "rid",            "description": "<p>The room id if user join a room</p>"          }        ]      }    },    "description": "<p>update the user details</p>",    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "optional": false,            "field": "Unauthorized",            "description": "<p>Login required</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "BadRequest",            "description": "<p>Invalid user id</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "NotFound",            "description": "<p>User does not exist</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "Forbidden",            "description": "<p>You do not have right to modify this user</p>"          }        ]      }    },    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\n\t\"status\": \"success\",\n\t\"data\": {\n\t\t\"_id\": \"5895abc7b9556ac3aada3d4f\",\n\t\t\"fbid\": \"facebook id\",\n\t\t\"name\": \"name\",\n\t\t...\n\t}\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "./apis/v1/index.js",    "groupTitle": "User",    "name": "PutApiV1UsersId"  }] });
