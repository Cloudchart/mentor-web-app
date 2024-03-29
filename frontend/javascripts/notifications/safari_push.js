function checkRemotePermission (permissionData) {
  if (permissionData.permission == 'default') {
    // This is a new web service URL and its validity is unknown.
    window.safari.pushNotification.requestPermission(SAFARI_PUSH_URL, SAFARI_PUSH_ID, {}, checkRemotePermission)
  } else if (permissionData.permission == 'denied') {
    // The user said no. Talk to your UX expert to see what you can do to entice your
    // users to subscribe to push notifications.
  } else if (permissionData.permission == 'granted') {
    // The web service URL is a valid push provider, and the user said yes.
    // permissionData.deviceToken is now available to use.
    fetch('device_tokens', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        value: permissionData.deviceToken
      })
    })
  }
}

export function requestSafariPush () {
  // Ensure that the user can receive Safari Push Notifications.
  if (SAFARI_PUSH_ID && SAFARI_PUSH_URL && 'safari' in window && 'pushNotification' in window.safari) {
    let permissionData = window.safari.pushNotification.permission(SAFARI_PUSH_ID)
    checkRemotePermission(permissionData)
  } else {
    // A good time to let a user know they are missing out on a feature or just bail out completely?
  }
}
