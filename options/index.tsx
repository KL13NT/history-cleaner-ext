import React, { useEffect, useState } from "react"

import { Storage } from "@plasmohq/storage"

import "./options.css"

const storage = new Storage()

const DEFAULT_DOMAINS = [
  "facebook.com",
  "instagram.com",
  "x.com",
  "reddit.com",
  "pinterest.com"
]

const Options = () => {
  const [domains, setDomains] = useState<string[]>([])
  const [newDomain, setNewDomain] = useState("")
  const [status, setStatus] = useState({ message: "", type: "" })

  // Load saved domains on component mount
  useEffect(() => {
    storage.getItem<string[]>("monitoredDomains").then((items) => {
      setDomains(items)
    })
  }, [])

  // Show status message with auto-hide
  const showStatus = (message: string, type: string) => {
    setStatus({ message, type })
    setTimeout(() => setStatus({ message: "", type: "" }), 3000)
  }

  // Add a new domain
  const addDomain = () => {
    const trimmedDomain = newDomain.trim()

    if (!trimmedDomain) {
      showStatus("Please enter a domain.", "error")
      return
    }

    if (domains.includes(trimmedDomain)) {
      showStatus("This domain is already in the list.", "error")
      return
    }

    setDomains([...domains, trimmedDomain])
    setNewDomain("")
    showStatus("Domain added. Remember to save your changes.", "success")
  }

  // Remove a domain
  const removeDomain = (index: number) => {
    const updatedDomains = [...domains]
    updatedDomains.splice(index, 1)
    setDomains(updatedDomains)
    showStatus("Domain removed. Remember to save your changes.", "success")
  }

  // Save options
  const saveOptions = () => {
    // Filter out empty domains
    storage.setItem("monitoredDomains", domains).then(() => {
      showStatus("Options saved successfully!", "success")
    })
  }

  // Reset to defaults
  const resetToDefaults = () => {
    setDomains([...DEFAULT_DOMAINS])
    showStatus(
      "Reset to default domains. Remember to save your changes.",
      "success"
    )
  }

  // Handle enter key in input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addDomain()
    }
  }

  return (
    <div className="container">
      <h1>Social Media Monitor Settings</h1>
      <p>Add or remove domains to monitor for social media usage:</p>

      <div className="domain-list">
        {domains.map((domain, index) => (
          <div key={index} className="domain-item">
            <input
              type="text"
              value={domain}
              className="domain-text"
              onChange={(e) => {
                const updatedDomains = [...domains]
                updatedDomains[index] = e.target.value
                setDomains(updatedDomains)
              }}
            />
            <button onClick={() => removeDomain(index)}>Remove</button>
          </div>
        ))}
      </div>

      <div className="add-domain">
        <input
          type="text"
          value={newDomain}
          placeholder="Enter domain (e.g., twitter.com)"
          className="domain-text"
          onChange={(e) => setNewDomain(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={addDomain}>Add Domain</button>
      </div>

      <div className="actions">
        <button onClick={saveOptions}>Save Options</button>
        <button onClick={resetToDefaults}>Reset to Defaults</button>
      </div>

      {status.message && (
        <div className={`status ${status.type}`}>{status.message}</div>
      )}
    </div>
  )
}

export default Options
