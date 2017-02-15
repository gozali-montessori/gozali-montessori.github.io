(function (global) {
    "use strict";

    var gozali = global.gozali = global.gozali || {};
    var _listeners = [],
        _pushStateSupported = !!(window.history && history.pushState),
        _ensureLeadHashRgx = /^[^\#]|^$/,
        _normalizeHashRgx = /^#|\&$/,
        _hash;

    function start() {
        _hash = location.hash;

        window.addEventListener("hashchange", _onHashChange, false);
    }

    function change(hash) {

        if (!_isSameHash(hash, _hash)) {

            hash =  _setLeadHash(hash);

            if (_pushStateSupported){
                window.history.pushState({}, document.title, hash);
            }
            else {
                document.location.hash = hash;
            }

            _hash = hash;

            _updateListeners();
        }
    }

    function addListener(fn) {
        _listeners.push(fn);

        if (_hash){
            fn(_hash);
        }
    }

    function getCurrent() {
	    return _hash;
    }

    function _onHashChange() {
        if (!_isSameHash(_hash, document.location.hash)) {
            _hash = document.location.hash;
            _updateListeners();
        }
    }

    function _updateListeners(){
        _listeners.forEach(function(fn){
            fn(_hash);
        });
    }

    function _setLeadHash(hash) {
        return hash.replace(_ensureLeadHashRgx, "#$&");
    }

    function _isSameHash(hashA, hashB) {
        return _normalizeHash(hashA) === _normalizeHash(hashB);
    }

    function _normalizeHash(hash) {
        return hash.replace(_normalizeHashRgx, "");
    }

    gozali.history = {
        start: start,
        addListener: addListener,
        change: change,
	    getCurrent: getCurrent
    };
})(window);
