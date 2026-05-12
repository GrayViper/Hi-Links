const dns = require('dns');
const dnsPromises = require('dns').promises;

// Use Google DNS for custom resolution
dnsPromises.setServers(['8.8.8.8', '8.8.4.4']);

const originalLookup = dns.lookup;

dns.lookup = function(domain, options, callback) {
  let cb = callback;
  if (typeof options === 'function') {
    cb = options;
    options = {};
  } else if (typeof options === 'number') {
    options = { family: options };
  }
  
  if (domain && domain.includes('.neon.tech')) {
    console.log('[DNS Patch] Resolving:', domain);
    dnsPromises.resolve4(domain).then(addresses => {
      console.log('[DNS Patch] Found addresses:', addresses);
      if (addresses && addresses.length > 0) {
        if (options && options.all) {
          cb(null, addresses.map(a => ({ address: a, family: 4 })));
        } else {
          cb(null, addresses[0], 4);
        }
      } else {
        originalLookup(domain, options, cb);
      }
    }).catch(err => {
      console.error('[DNS Patch] Error resolving:', err.message);
      originalLookup(domain, options, cb);
    });
    return;
  }
  return originalLookup(domain, options, cb);
};
