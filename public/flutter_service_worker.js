'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "a6fee27373aed1819d8556261cb52e32",
"favicon.ico": "057f131a48987f35a484afd9137f688e",
"index.html": "0922cfa67ce148ee37061fc83cb67638",
"/": "0922cfa67ce148ee37061fc83cb67638",
"main.dart.js": "2a90d4f26a559ac09604890c6b339193",
"manifest-old.json": "52d1a72171b5c666fa73f47904281b71",
"icons/icon-192x192.png": "5f8994f9901f04987739c6d9b9e1b819",
"icons/icon-256x256.png": "dbc96a6be1a81774ce9499c3883f4fcc",
"icons/icon-384x384.png": "84ae1c8d1ef507359a1345a576eee052",
"icons/apple-touch-icon.png": "23b82dda88224dafb0f288f3c88b5e7b",
"icons/icon-192.png": "39581f13a39de98e2f4cff59fc709a20",
"icons/icon-192-maskable.png": "b4f18ab330c772797860c1e62be1ed8e",
"icons/icon-512-maskable.png": "806df75fc4bb36e9cf54d2b9099aa6b7",
"icons/icon-512x512.png": "9ebec740c93faa16490b16467241379d",
"icons/icon-512.png": "153397e054a3e7c24c3fc19eefa9b1b8",
"manifest.json": "46a00385c068b1d424172351fb677821",
"assets/AssetManifest.json": "0e57acc9b72b29827493f06ea55cf72c",
"assets/NOTICES": "429b61ef7624203cab19b265e1b16953",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/fonts/MaterialIcons-Regular.otf": "7e7a6cccddf6d7b20012a548461d5d81",
"assets/assets/ylwbkgnd.png": "f0db43c715e63d2324027b81dc9702fd",
"assets/assets/4L.png": "00917067662c416cd6c7177637b8eb39",
"assets/assets/Settings.png": "d136125fed704fcf7c5dfc86a233b4ef",
"assets/assets/bluebkgrnd.png": "e70ec62efb8c6b8e7ba899f1934ffc91",
"assets/assets/2L.png": "6af3f6623f6f5c152acad697b6b1a5de",
"assets/assets/1D.png": "a3649cb6cee9098b3c42da775476f2b4",
"assets/assets/3L.png": "db02b2d0957d461e329828c85e343c2d",
"assets/assets/SVGs/Settings.png": "d136125fed704fcf7c5dfc86a233b4ef",
"assets/assets/SVGs/Moon.png": "106c9301e997062c1d1c7261d0b6c328",
"assets/assets/Moon.png": "106c9301e997062c1d1c7261d0b6c328",
"assets/assets/grnbkgrnd.png": "f5e875c56eb69eea4c445c58860cc638",
"assets/assets/2D.png": "0c4dc3225b25d3f959dbd248ae0cb07f",
"assets/assets/1L.png": "dfc618d84572e7c8ef7975c9b6f43a6d",
"assets/assets/3D.png": "6b3874e3e6c9452b39a5e2d400c4e0de",
"assets/assets/bckgrnd.png": "526e3a6bcc3c91893cc941fa4788433c",
"assets/assets/4D.png": "e4632b73bbb64bf30bfa67375a3c8716",
"index-old.html": "83cab69d9c2bef7c4443ce64959d6119",
"canvaskit/canvaskit.js": "c2b4e5f3d7a3d82aed024e7249a78487",
"canvaskit/profiling/canvaskit.js": "ae2949af4efc61d28a4a80fffa1db900",
"canvaskit/profiling/canvaskit.wasm": "95e736ab31147d1b2c7b25f11d4c32cd",
"canvaskit/canvaskit.wasm": "4b83d89d9fecbea8ca46f2f760c5a9ba"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
