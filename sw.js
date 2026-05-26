const CACHE_NAME = 'mess-manager-cache-v2';

// যেসব ফাইল অফলাইনেও লোড রাখা দরকার
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  'https://fonts.googleapis.com/css2?family=Galada&family=Poppins:wght@300;400;600&family=Hind+Siliguri:wght@400;600&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// ইনস্টল এবং ক্যাশ তৈরি
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// লাইভ নেটওয়ার্ক রিকোয়েস্ট হ্যান্ডেল করা
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  // আপনার শর্ত: ফেসবুক বা থার্ড পার্টি লিংকে অফলাইনে ক্লিক করলে যেন কাজ না করে 
  if (requestUrl.hostname.includes('facebook.com')) {
    return; // এটি সরাসরি ইন্টারনেটে হিট করবে, অফলাইনে আটকে যাবে
  }

  // বাকি ইন্টারনাল কাজের জন্য ক্যাশ থেকে ডেটা রিলিজ করা
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
