import { Storage } from "@plasmohq/storage"

const storage = new Storage()

const DEFAULT_DOMAINS = [
  "facebook.com",
  "instagram.com",
  "x.com",
  "reddit.com",
  "pinterest.com"
]

let MONITORED_DOMAINS = [...DEFAULT_DOMAINS]

storage.watch({
  monitoredDomains: (items) => {
    console.log("Storage updated:", items)
    MONITORED_DOMAINS = items.newValue
  }
})

function isSocialMediaSite(url: string): boolean {
  try {
    const hostname = new URL(url).hostname

    return MONITORED_DOMAINS.some((domain) => {
      // For items that include paths (like google.com/maps)
      if (domain.includes("/")) {
        return url.includes(domain)
      }

      return hostname.includes(domain)
    })
  } catch (e) {
    console.error("Error parsing URL:", e)
    return false
  }
}

chrome.tabs.onUpdated.addListener((_, changeInfo) => {
  if (changeInfo.url && isSocialMediaSite(changeInfo.url)) {
    chrome.history.deleteUrl({
      url: changeInfo.url
    })
    console.log(`Social media URL visited: ${changeInfo.url}`)
  }
})

chrome.runtime.onInstalled.addListener(async (details) => {
  const items = await storage.getItem("monitoredDomains")

  if (!items) {
    await storage.setItem("monitoredDomains", DEFAULT_DOMAINS)
    console.log("Storage initialized with default domains:", DEFAULT_DOMAINS)
  }

  console.log("Initialised with domains:", items)
  console.log("Extension installed/updated:", details.reason)
})
