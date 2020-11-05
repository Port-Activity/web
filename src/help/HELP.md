# Port Activity Application

## Notifications
Notifications are divided into two categories:
* Port notifications
* Ship notifications

All notifications are always global and readable by every user. The difference is that port notifications always trigger a push notification in mobile devices. Ship notifications trigger push notification in mobile device only if user has pinned the vessel.
### Sending port notifications
**Required access level: Role with "Send push notifications" permission enabled**

`Main menu -> Notifications -> Send port notification`
### Sending ship notifications
**Required access level: Role with "Send push notifications" permission enabled**

`Activity view -> Vessel badge -> Show more -> Send notification`
### Reading notifications
`Main menu -> Notifications`

Select different tabs to filter shown notifications
* `All notifications`: Shows ship and port notifications
* `Ship notifications`: Shows ship notifications only
* `Port notifications`: Shows port notifications only

## Vessels

`Main menu -> Vessels`

Shows all vessels stored in database

### Hiding and unhiding vessels
**Required access level: Role with "Manage port calls" permission enabled**

`Main menu -> Vessels -> Hide/Show`

This toggle will hide or unhide vessels from main activity view. It will not affect visibility of vessels in other views.
Visible column in vessels list will indicate if vessel is visible T(rue) or not visible F(alse).

### Viewing and manipulating vessel timestamps
**Required access level: Role with "Manage port calls" permission enabled**

`Main menu -> Vessels -> Show timestamps`

Shows all timestamps stored to database for the selected vessel.

#### Changing timestamp port call ID manually
**Required access level: Role with "Manage port calls" permission enabled**

`Main menu -> Vessels -> Show timestamps -> Change port call ID and Save`

Each timestamp usually has port call ID attached to it. If there is no port call ID attached to it, it is considered orphan.
Attached port call ID can be changed manually by setting value of the port call ID field to a valid port call ID and pressing save.
If valid port call ID is set to a timestamp marked as trash the timestamp will not be trash anymore. Port calls cannot contain trash timestamps.
If port call ID is cleared and save is pressed, then timestamp is orphaned. This will also mark the timestamp as being trash.

#### Permanently deleting timestamp from database
**Required access level: Role with "Manage port calls" permission enabled**

`Main menu -> Vessels -> Show timestamps -> Delete and confirm`

After pressing delete and confirming the action, the timestamp will be permanently deleted from database.

#### Viewing timestamp data
**Required access level: Role with "Manage port calls" permission enabled**

`Main menu -> Vessels -> Show timestamps -> Show`

This will show the raw timestamp data stored to database.

#### Restore timestamp from trash
**Required access level: Role with "Manage port calls" permission enabled**

`Main menu -> Vessels -> Show timestamps -> Restore` (Visible only if timestamp is marked as trash)

This will remove the trash status from timestamp so that it can be automatically attached to a port call.

### Automatically attaching orphan timestamps
**Required access level: Role with "Manage port calls" permission enabled**

`Main menu -> Vessels -> Attach orphan timestamps and confirm`

This will try to attach any orphan timestamps to a valid port call ID.

### Rebuilding port calls
**Required access level: Role with "Manage port calls" permission enabled**

`Main menu -> Vessels -> Rebuild port calls and confirm`

This will:
* Remove all vessel port calls from database
* Deattach all vessel timestamps from port calls
* Rescan all timestamps and build new port calls
* Attach all vessel timestamps to new port calls

## Viewing port calls
**Required access level: Role with "Manage port calls" permission enabled**

`Main menu -> Port call timesheets`

Shows all port calls stored in database.

### Viewing and manipulating port call timestamps
**Required access level: Role with "Manage port calls" permission enabled**

`Main menu -> Port call timesheets -> + sign`

Shows all timestamps attached to the selected port call and also timestamps not attached to any port call.

#### Changing timestamp port call ID manually
**Required access level: Role with "Manage port calls" permission enabled**

`Main menu -> Port call timesheets -> + sign -> Change port call ID and Save`

Each timestamp usually has port call ID attached to it. If there is no port call ID attached to it, it is considered orphan.
Attached port call ID can be changed manually by setting value of the port call ID field to a valid port call ID and pressing save.
If valid port call ID is set to a timestamp marked as trash the timestamp will not be trash anymore. Port calls cannot contain trash timestamps.
If port call ID is cleared and save is pressed, then timestamp is orphaned. This will also mark the timestamp as being trash.

### Viewing port call timesheet
**Required access level: Role with "Manage port calls" permission enabled**

`Main menu -> Port call timesheets -> Timesheet`

`Activity view -> Badge -> Click on IMO`

Shows a list of last resolved times for port call activities.

### Closing port call manually
**Required access level: Role with "Manage port calls" permission enabled**

`Main menu -> Port call timesheets -> Close port call and confirm`

This will forcefully mark the port call as done.
Since ATD must be known for each port call marked as done a best match timestamp value will be taken as ATD if actual ATD is not available.

### Re-scanning port call manually
**Required access level: Role with "Manage port calls" permission enabled**

`Main menu -> Port call timesheets -> Re-scan port call and confirm`

This will forcefully re-scan the port call timestamps and build new timesheet based on the timestamp values.
This can be used to restore a manually closed port call back to previous state.
