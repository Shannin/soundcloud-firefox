'use strict'

var audiocontrols = require("./audiocontrols");

const self = require("sdk/self");
const panels = require("sdk/panel");
const {ToggleButton} = require("sdk/ui/button/toggle");

/*
    Initialize panel
        The Soundcloud API relies on the window object, something that the Firefox toolbar doesn't have
        Therefore, it needs to be inserted into the panel content.  Because of this, the panel needs to
        be created before the at least the audio controls since they will need to interface between the
        two.  I need to pass the "player" to the controls since I'm not able to pass objects to a
        content script (at least as far as I know)
*/

var panel = panels.Panel({
    width: 300,
    height: 220,
    contentURL: self.data.url('interface.html'),
    contentScriptFile: [
        self.data.url('libs/soundmanager/script/soundmanager2-jsmin.js'),
        self.data.url('libs/soundcloud.js'),
        self.data.url('audioplayer.js'),
    ],
    onHide: panelOnHide,
});


/*
    Since the actual player can't be passed, the port is passed since that's the interface given to us
    by Mozilla and the controller will just emit message using some defined formatting
*/

audiocontrols.create(panel.port);


// Create Soundcloud button
var soundcloudButton = ToggleButton({
    id: 'soundcloud-button',
    label: 'Soundcloud Interface',
    icon: './btn_soundcloud-32.png',
    onChange: soundcloudButtonOnChange,
    
});

function soundcloudButtonOnChange (state) {
    if (state.checked) {
        panel.show({
            position: soundcloudButton,
        });
    }
}

function panelOnHide () {
    soundcloudButton.state('window', {checked: false});
}
