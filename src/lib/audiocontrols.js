'use strict'

const self = require("sdk/self");
const panels = require("sdk/panel");
const worker = require("sdk/content/worker");

const {Cu} = require("chrome");
const {CustomizableUI} = Cu.import("resource:///modules/CustomizableUI.jsm", {});
const {loadSheet} = require("sdk/stylesheet/utils");

const kNSXUL = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";

var audioplayer = null;

var elements = {
    prevBtn: null,
    playBtn: null,
    nextBtn: null,
}

exports.create = function (newAudioplayer) {
    // Create audio controller
    CustomizableUI.createWidget({
        id: "audio-controls",
        type: "custom",
        defaultArea: CustomizableUI.AREA_NAVBAR,
        onBuild: function(document) {
            loadStyles(document, "styles.css");

            var node = document.createElementNS(kNSXUL, "toolbaritem");
            node.setAttribute("id", "audio-controls");
            node.setAttribute("removable", "true");

            var prevBtnNode = document.createElementNS(kNSXUL, "toolbarbutton");
            prevBtnNode.setAttribute("id", "prev-button");
            prevBtnNode.addEventListener("command", prev, false);
            node.appendChild(prevBtnNode);
            elements.prevBtn = prevBtnNode;

            var playBtnNode = document.createElementNS(kNSXUL, "toolbarbutton");
            playBtnNode.setAttribute("id", "play-button");
            playBtnNode.addEventListener("command", play, false);
            node.appendChild(playBtnNode);
            elements.playBtn = playBtnNode;

            var nextBtnNode = document.createElementNS(kNSXUL, "toolbarbutton");
            nextBtnNode.setAttribute("id", "next-button");
            nextBtnNode.addEventListener("command", next, false);
            node.appendChild(nextBtnNode);
            elements.nextBtn = nextBtnNode;

            finishCreate(newAudioplayer);

            return node;
        },
    });
};

function finishCreate(newAudioplayer) {
    audioplayer = newAudioplayer;
    if (!audioplayer) {
        setHasPrev(false);
        setHasNext(false);
        disablePlayPause(true);
        return;
    }

    audioplayer.on("audioplayer/isPlaying", function (isPlaying) {
        if (isPlaying) {
            elements.playBtn.classList.add("playing");
        } else {
            elements.playBtn.classList.remove("playing");
        }
    });
}

var loadStyles = function (document, stylesheet) {
    var sheet = self.data.load('./' + stylesheet);

    var re = /url\([\'\"](.*)[\'\"]\)/gm
    sheet = sheet.replace(re, function(m, name) {
        var contents = self.data.url(name);
        return "url('" + contents + "')";
    });

    var uri = "data:text/css;charset=utf-8," + encodeURIComponent(sheet);
    loadSheet(document.defaultView, uri);
}

function play() {
    audioplayer.emit("controls/play");
}

function prev() {
    audioplayer.emit("controls/prev");
}

function next() {
    audioplayer.emit("controls/next");
}

function setHasPrev(hasPrev) {
    if (hasPrev) {
        elements.prevBtn.setAttribute("disabled", "false");
    } else {
        elements.prevBtn.setAttribute("disabled", "true");
    }
}

function setHasNext(hasNext) {
    if (hasNext) {
        elements.nextBtn.setAttribute("disabled", "false");
    } else {
        elements.nextBtn.setAttribute("disabled", "true");
    }
}

function disablePlayPause(disable) {
    if (disable) {
        elements.playBtn.setAttribute("disabled", "true");
    } else {
        elements.playBtn.setAttribute("disabled", "false");
    }
}
