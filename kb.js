/**
 * Qui Borde ? - Little game ti learn touch typing
 * Copyright (C) 2012 Clochix
 *
 *  This file is part of Qui Borde.
 *
 *  Qui Borde is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  Qui Borde is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with Qui Borde.  If not, see <http://www.gnu.org/licenses/>
 */


var kb = (function() {
  var jsPrefix  = '', // prefix for css rules
      cssPrefix = '', // prefix for css rules
      letters   = [],
      keys      = {};
  /**
   * Insert style rule
   *
   * @param {String} rule
   */
  function addRule(rule) {
    if (document.styleSheets.length < 1) {
      document.getElementsByTagName('HEAD')[0].appendChild(document.createElement('style'));
    }
    document.styleSheets[0].insertRule(rule, 0);

    return this;
  }
  /**
   * Set a prefixed style on an element
   *
   * @param {DOMElement} elmt
   * @param {String}     key
   * @param {String}     val
   */
  function style(elmt, key, val) {
    elmt.style[jsPrefix + key] = val;
  }

  function setCurrentLetter() {
    var letter = letters[letters.length - 1];
    letter.elmt.classList.add('current');
    if (typeof keys[letter.letter] !== 'undefined') {
      var cl = keys[letter.letter].elmt.classList;
      cl.add('current');
      window.setTimeout(function() {
        cl.remove('current');
      }, 1000);
    }
  }

  /**
   * Animate next letter
   */
  function nextLetter() {
    var last = letters[letters.length - 1];
    last.elmt.parentNode.removeChild(last.elmt);
    letters.pop();
    letters[letters.length - 1].elmt.classList.add('falling');
    setCurrentLetter();
  }

  /**
   * Main
   *
   * @param {DOMElement}
   * @param {String}
   */
  function init(container, text){
    var animation = false,
        keyframeprefix = '',
        prefixes  = 'Webkit Moz O ms Khtml'.split(' '),
        i,j,
        body = document.body,
        keyboard = document.getElementById('keyboard'),
        key, line;

    if (body.style.animationName) {
      animation = true;
    } else {
      for (i = 0; i < prefixes.length; i++) {
        jsPrefix = prefixes[i];
        if (typeof body.style[jsPrefix + 'Animation'] !== 'undefined') {
          cssPrefix = '-' + jsPrefix.toLowerCase() + '-';
          animation = true;
          break;
        }
      }
    }
    /**
     * Handle key press
     */
    function onKeypress(e) {
      var last = letters[letters.length - 1],
          pressed = String.fromCharCode(e.charCode);
      if (typeof keys[pressed] !== 'undefined') {
        var cl = keys[pressed].elmt.classList;
        cl.add('pressed');
        window.setTimeout(function() {
          cl.remove('pressed');
        }, 250);
      }
      if (pressed === last.letter) {
        nextLetter();
      }
    }

    if (animation) {

      // Create keyboard
      var layout = [
        "azertyuiop",
        "qsdfghjklm",
        "wxcvbn"
      ];
      for (i = 0; i < layout.length; i++) {
        line = document.createElement("div");
        line.setAttribute('class', 'line');
        keyboard.appendChild(line);
        for (j = 0; j < layout[i].length; j++) {
          key = document.createElement("div");
          key.setAttribute('class', 'key');
          key.innerHTML = layout[i][j];
          line.appendChild(key);
          keys[layout[i][j]] = {
            elmt: key
          }
        }
      }

      body.addEventListener('keypress', onKeypress, false);
      
      text = text.replace(/ /g, '').toLowerCase();
      for (i = 0; i < text.length; i++) {
        container.appendChild(addLetter(text[i]));
      }
      letters[letters.length - 1].elmt.classList.add('falling');
      setCurrentLetter();
    } else {
      window.alert("Your browser doesn't support animations");
    }
  }
  function addLetter(letter){
    var elmt = document.createElement("span");
    var listener = function(e) {
      //console.log(e, letter);
    }
    var onEnd = function(e) {
      if (e.animationName === 'fall') {
          nextLetter();
      }
    }
    elmt.setAttribute('class', 'letter');
    elmt.innerHTML = letter;
    elmt.style.left = Math.floor(getRandom(20, 80))+"%";
    style(elmt, 'AnimationDuration', "5s");
    style(elmt, 'AnimationDelay', "0s");
    style(elmt, 'AnimationIterationCount', 1);
    elmt.addEventListener("animationstart", listener, false);
    elmt.addEventListener("animationend", onEnd, false);
    //elmt.addEventListener("animationiteration", listener, false);
    elmt.addEventListener("click", function() {
      elmt.parentNode.removeChild(elmt);
    }, false);

    letters.unshift({
      letter: letter,
      elmt: elmt
    });

    
    return elmt;
  }
  /* Generate random numbers with 'max' and 'min' values  */
  function getRandom(min, max){  
    return (Math.random() * (max - min + 1) + min);  
  }
  
  return {
    init: init
  };
})()
//kb.init(document.body, "Join us now and share the software, you'll be free hacker, you'll be free");
kb.init(document.getElementById('main'), "J ai vu un punk afghan et deux clowns aux zygomatiques incroyables");

