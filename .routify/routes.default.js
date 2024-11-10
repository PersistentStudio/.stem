

export default {
  "meta": {},
  "id": "_default",
  "name": "",
  "file": {
    "path": "src/routes",
    "dir": "src",
    "base": "routes",
    "ext": "",
    "name": "routes"
  },
  "rootName": "default",
  "routifyDir": import.meta.url,
  "children": [
    {
      "meta": {},
      "id": "_default_README_md",
      "name": "README",
      "file": {
        "path": "src/routes/README.md",
        "dir": "src/routes",
        "base": "README.md",
        "ext": ".md",
        "name": "README"
      },
      "asyncModule": () => import('../src/routes/README.md'),
      "children": []
    },
    {
      "meta": {},
      "id": "_default_chat",
      "name": "chat",
      "module": false,
      "file": {
        "path": "src/routes/chat",
        "dir": "src/routes",
        "base": "chat",
        "ext": "",
        "name": "chat"
      },
      "children": [
        {
          "meta": {},
          "id": "_default_chat_chat_svelte",
          "name": "chat",
          "file": {
            "path": "src/routes/chat/chat.svelte",
            "dir": "src/routes/chat",
            "base": "chat.svelte",
            "ext": ".svelte",
            "name": "chat"
          },
          "asyncModule": () => import('../src/routes/chat/chat.svelte'),
          "children": []
        },
        {
          "meta": {},
          "id": "_default_chat_chatai_svelte",
          "name": "chatai",
          "file": {
            "path": "src/routes/chat/chatai.svelte",
            "dir": "src/routes/chat",
            "base": "chatai.svelte",
            "ext": ".svelte",
            "name": "chatai"
          },
          "asyncModule": () => import('../src/routes/chat/chatai.svelte'),
          "children": []
        },
        {
          "meta": {},
          "id": "_default_chat_chatinput_svelte",
          "name": "chatinput",
          "file": {
            "path": "src/routes/chat/chatinput.svelte",
            "dir": "src/routes/chat",
            "base": "chatinput.svelte",
            "ext": ".svelte",
            "name": "chatinput"
          },
          "asyncModule": () => import('../src/routes/chat/chatinput.svelte'),
          "children": []
        },
        {
          "meta": {},
          "id": "_default_chat_chatmessage_svelte",
          "name": "chatmessage",
          "file": {
            "path": "src/routes/chat/chatmessage.svelte",
            "dir": "src/routes/chat",
            "base": "chatmessage.svelte",
            "ext": ".svelte",
            "name": "chatmessage"
          },
          "asyncModule": () => import('../src/routes/chat/chatmessage.svelte'),
          "children": []
        },
        {
          "meta": {},
          "id": "_default_chat_chatthread_svelte",
          "name": "chatthread",
          "file": {
            "path": "src/routes/chat/chatthread.svelte",
            "dir": "src/routes/chat",
            "base": "chatthread.svelte",
            "ext": ".svelte",
            "name": "chatthread"
          },
          "asyncModule": () => import('../src/routes/chat/chatthread.svelte'),
          "children": []
        }
      ]
    },
    {
      "meta": {},
      "id": "_default_dashboard",
      "name": "dashboard",
      "module": false,
      "file": {
        "path": "src/routes/dashboard",
        "dir": "src/routes",
        "base": "dashboard",
        "ext": "",
        "name": "dashboard"
      },
      "children": [
        {
          "meta": {},
          "id": "_default_dashboard_ActivityFeed_svelte",
          "name": "ActivityFeed",
          "file": {
            "path": "src/routes/dashboard/ActivityFeed.svelte",
            "dir": "src/routes/dashboard",
            "base": "ActivityFeed.svelte",
            "ext": ".svelte",
            "name": "ActivityFeed"
          },
          "asyncModule": () => import('../src/routes/dashboard/ActivityFeed.svelte'),
          "children": []
        },
        {
          "meta": {},
          "id": "_default_dashboard_Notifications_svelte",
          "name": "Notifications",
          "file": {
            "path": "src/routes/dashboard/Notifications.svelte",
            "dir": "src/routes/dashboard",
            "base": "Notifications.svelte",
            "ext": ".svelte",
            "name": "Notifications"
          },
          "asyncModule": () => import('../src/routes/dashboard/Notifications.svelte'),
          "children": []
        },
        {
          "meta": {},
          "id": "_default_dashboard_PeerGroups_svelte",
          "name": "PeerGroups",
          "file": {
            "path": "src/routes/dashboard/PeerGroups.svelte",
            "dir": "src/routes/dashboard",
            "base": "PeerGroups.svelte",
            "ext": ".svelte",
            "name": "PeerGroups"
          },
          "asyncModule": () => import('../src/routes/dashboard/PeerGroups.svelte'),
          "children": []
        },
        {
          "meta": {},
          "id": "_default_dashboard_QuickAccess_svelte",
          "name": "QuickAccess",
          "file": {
            "path": "src/routes/dashboard/QuickAccess.svelte",
            "dir": "src/routes/dashboard",
            "base": "QuickAccess.svelte",
            "ext": ".svelte",
            "name": "QuickAccess"
          },
          "asyncModule": () => import('../src/routes/dashboard/QuickAccess.svelte'),
          "children": []
        },
        {
          "meta": {},
          "id": "_default_dashboard_profile_svelte",
          "name": "profile",
          "file": {
            "path": "src/routes/dashboard/profile.svelte",
            "dir": "src/routes/dashboard",
            "base": "profile.svelte",
            "ext": ".svelte",
            "name": "profile"
          },
          "asyncModule": () => import('../src/routes/dashboard/profile.svelte'),
          "children": []
        },
        {
          "meta": {},
          "id": "_default_dashboard_profileengagement_svelte",
          "name": "profileengagement",
          "file": {
            "path": "src/routes/dashboard/profileengagement.svelte",
            "dir": "src/routes/dashboard",
            "base": "profileengagement.svelte",
            "ext": ".svelte",
            "name": "profileengagement"
          },
          "asyncModule": () => import('../src/routes/dashboard/profileengagement.svelte'),
          "children": []
        },
        {
          "meta": {},
          "id": "_default_dashboard_profilenav_svelte",
          "name": "profilenav",
          "file": {
            "path": "src/routes/dashboard/profilenav.svelte",
            "dir": "src/routes/dashboard",
            "base": "profilenav.svelte",
            "ext": ".svelte",
            "name": "profilenav"
          },
          "asyncModule": () => import('../src/routes/dashboard/profilenav.svelte'),
          "children": []
        }
      ]
    },
    {
      "meta": {},
      "id": "_default_expertiselevel_svelte",
      "name": "expertiselevel",
      "file": {
        "path": "src/routes/expertiselevel.svelte",
        "dir": "src/routes",
        "base": "expertiselevel.svelte",
        "ext": ".svelte",
        "name": "expertiselevel"
      },
      "asyncModule": () => import('../src/routes/expertiselevel.svelte'),
      "children": []
    },
    {
      "meta": {},
      "id": "_default_forum_svelte",
      "name": "forum",
      "file": {
        "path": "src/routes/forum.svelte",
        "dir": "src/routes",
        "base": "forum.svelte",
        "ext": ".svelte",
        "name": "forum"
      },
      "asyncModule": () => import('../src/routes/forum.svelte'),
      "children": []
    },
    {
      "meta": {
        "isDefault": true
      },
      "id": "_default_index_svelte",
      "name": "index",
      "file": {
        "path": "src/routes/index.svelte",
        "dir": "src/routes",
        "base": "index.svelte",
        "ext": ".svelte",
        "name": "index"
      },
      "asyncModule": () => import('../src/routes/index.svelte'),
      "children": []
    },
    {
      "meta": {},
      "id": "_default_lmap",
      "name": "lmap",
      "module": false,
      "file": {
        "path": "src/routes/lmap",
        "dir": "src/routes",
        "base": "lmap",
        "ext": "",
        "name": "lmap"
      },
      "children": [
        {
          "meta": {},
          "id": "_default_lmap_learningmap_svelte",
          "name": "learningmap",
          "file": {
            "path": "src/routes/lmap/learningmap.svelte",
            "dir": "src/routes/lmap",
            "base": "learningmap.svelte",
            "ext": ".svelte",
            "name": "learningmap"
          },
          "asyncModule": () => import('../src/routes/lmap/learningmap.svelte'),
          "children": []
        },
        {
          "meta": {},
          "id": "_default_lmap_learningpath_svelte",
          "name": "learningpath",
          "file": {
            "path": "src/routes/lmap/learningpath.svelte",
            "dir": "src/routes/lmap",
            "base": "learningpath.svelte",
            "ext": ".svelte",
            "name": "learningpath"
          },
          "asyncModule": () => import('../src/routes/lmap/learningpath.svelte'),
          "children": []
        }
      ]
    },
    {
      "meta": {},
      "id": "_default_profile",
      "name": "profile",
      "module": false,
      "file": {
        "path": "src/routes/profile",
        "dir": "src/routes",
        "base": "profile",
        "ext": "",
        "name": "profile"
      },
      "children": [
        {
          "meta": {},
          "id": "_default_profile_profile_svelte",
          "name": "profile",
          "file": {
            "path": "src/routes/profile/profile.svelte",
            "dir": "src/routes/profile",
            "base": "profile.svelte",
            "ext": ".svelte",
            "name": "profile"
          },
          "asyncModule": () => import('../src/routes/profile/profile.svelte'),
          "children": []
        }
      ]
    },
    {
      "meta": {},
      "id": "_default_threadcard_svelte",
      "name": "threadcard",
      "file": {
        "path": "src/routes/threadcard.svelte",
        "dir": "src/routes",
        "base": "threadcard.svelte",
        "ext": ".svelte",
        "name": "threadcard"
      },
      "asyncModule": () => import('../src/routes/threadcard.svelte'),
      "children": []
    },
    {
      "meta": {},
      "id": "_default_topicnav_svelte",
      "name": "topicnav",
      "file": {
        "path": "src/routes/topicnav.svelte",
        "dir": "src/routes",
        "base": "topicnav.svelte",
        "ext": ".svelte",
        "name": "topicnav"
      },
      "asyncModule": () => import('../src/routes/topicnav.svelte'),
      "children": []
    },
    {
      "meta": {
        "dynamic": true,
        "dynamicSpread": true,
        "order": false,
        "inline": false
      },
      "name": "[...404]",
      "file": {
        "path": ".routify/components/[...404].svelte",
        "dir": ".routify/components",
        "base": "[...404].svelte",
        "ext": ".svelte",
        "name": "[...404]"
      },
      "asyncModule": () => import('./components/[...404].svelte'),
      "children": []
    }
  ]
}