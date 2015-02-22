'use strict';

var genericStyleBuilder = function(selectedText, styleMatchPre, styleMatchPost, stylePre, stylePost) {
  var regex = new RegExp('^' + styleMatchPre + '(.*)' + styleMatchPost + '$');
  var isStyled = regex.exec(selectedText);
  var text;
  if (isStyled && isStyled.length === 2) {
    text = isStyled[1];
  } else {
    text = stylePre + selectedText + stylePost;
  }
  return {
    text: text,
    defaultSelection: stylePre.length
  };
};

var genericListBuilder = function(selectedText, bulletMatch, bullet) {
  var regex = new RegExp(bulletMatch + '(\\s)(.*)(\\n{0,1})', 'gm');
  var isList = selectedText.match(regex);
  var text = '';
  if (isList) {
    isList.forEach(function(li) {
      var replaceRegex = new RegExp(bulletMatch + '(\\s)');
      text += li.replace(replaceRegex, '');
    });
  } else {
    var lines = selectedText.split('\n');
    text = bullet + ' ' + lines.join('\n' + bullet + ' ');
  }
  return {
    text: text,
    defaultSelection: bullet.length + 1
  };
};

var hotkeys = {
  'cge-bold': ['ctrl+b', 'meta+b'],
  'cge-italic': ['ctrl+i', 'meta+i'],
  'cge-strikethrough': ['ctrl+s', 'meta+s'],
  'cge-h1': ['alt+1'],
  'cge-h2': ['alt+2'],
  'cge-h3': ['alt+3'],
  'cge-quote': ['ctrl+q', 'meta+q'],
  'cge-code': ['ctrl+d', 'meta+d'],
  'cge-link': ['ctrl+k', 'meta+k'],
  'cge-image': ['ctrl+m', 'meta+m'],
  'cge-unordered-list': ['ctrl+u', 'meta+u'],
  'cge-ordered-list': ['ctrl+o', 'meta+o'],
  'cge-check-list': ['ctrl+h', 'meta+h'],
  'cge-horizontal-rule': ['ctrl+l', 'meta+l']
};

var listeners = {
  'cge-bold': function(selectedText) {
    return genericStyleBuilder(selectedText, '\\*\\*', '\\*\\*', '**', '**');
  },
  'cge-italic': function(selectedText) {
    return genericStyleBuilder(selectedText, '\\*', '\\*', '*', '*');
  },
  'cge-strikethrough': function(selectedText) {
    return genericStyleBuilder(selectedText, '~~', '~~', '~~', '~~');
  },
  'cge-quote': function(selectedText) {
    return genericStyleBuilder(selectedText, '> ', '', '> ', '');
  },
  'cge-h1': function(selectedText) {
    return genericStyleBuilder(selectedText, '\\#{1} ', '', '# ', '');
  },
  'cge-h2': function(selectedText) {
    return genericStyleBuilder(selectedText, '\\#{2} ', '', '## ', '');
  },
  'cge-h3': function(selectedText) {
    return genericStyleBuilder(selectedText, '\\#{3} ', '', '### ', '');
  },
  'cge-code': function(selectedText) {
    var isMultiCode = /^```\n((.|\n)*)\n```$/m.exec(selectedText);
    var text;
    if (isMultiCode && isMultiCode.length >= 2) {
      text = isMultiCode[1];
    } else {
      var isSingleCode = /^`(.*)`$/i.exec(selectedText);
      if (isSingleCode && isSingleCode.length === 2) {
        text = isSingleCode[1];
      } else if (selectedText.indexOf('\n') >= 0) {
        text = '```\n' + selectedText + '\n```';
      } else {
        text = '`' + selectedText + '`';
      }
    }
    return {
      text: text,
      defaultSelection: 1
    };
  },
  'cge-link': function(selectedText) {
    var isLink = /^\[(.*)\]\(.*\)$/i.exec(selectedText);
    var text, selectionStart, selectionEnd;
    if (isLink && isLink.length === 2) {
      text = isLink[1];
    } else {
      text = '[' + selectedText + ']()';
      selectionStart = selectedText.length + 3;
      selectionEnd = selectionStart;
    }
    return {
      text: text,
      selectionStart: selectionStart,
      selectionEnd: selectionEnd,
      defaultSelection: 3
    };
  },
  'cge-image': function(selectedText) {
    var isLink = /^\!\[(.*)\]\(.*\)$/i.exec(selectedText);
    var text, selectionStart, selectionEnd;
    if (isLink && isLink.length === 2) {
      text = isLink[1];
    } else {
      text = '![' + selectedText + ']()';
      selectionStart = selectedText.length + 4;
      selectionEnd = selectionStart;
    }
    return {
      text: text,
      selectionStart: selectionStart,
      selectionEnd: selectionEnd,
      defaultSelection: 2
    };
  },
  'cge-unordered-list': function(selectedText) {
    return genericListBuilder(selectedText, '(\\*|-)', '*');
  },
  'cge-ordered-list': function(selectedText) {
    return genericListBuilder(selectedText, '(\\d\\.)', '1.');
  },
  'cge-check-list': function(selectedText) {
    return genericListBuilder(selectedText, '(\\*|-)(\\s)(\\[(\\s|x|X)\\])', '* [ ]');
  },
  'cge-horizontal-rule': function(selectedText) {
    var isRule = /^\n(-{2,})$/.exec(selectedText);
    var text = '';
    if (!isRule) {
      text = '\n------';
    }
    return {
      text: text,
      defaultSelection: text.length
    };
  }
};

var getTextAreaSelection = function(textArea) {
  return [textArea.selectionStart, textArea.selectionEnd];
};

var applyEvent = function(eventType) {
  return function(event) {
    var textArea = $(event.target).parents('.chrome-github-editor').siblings('textarea.comment-form-textarea')[0];
    var selection = getTextAreaSelection(textArea);

    // get the selected text and its surroundings
    var content = $(textArea).val();
    var preText = content.substring(0, selection[0]);
    var selectedText = content.substring(selection[0], selection[1]);
    var postText = content.substring(selection[1], content.length);

    var newTextObj = listeners[eventType](selectedText);
    $(textArea)[0].value = preText + newTextObj.text + postText;

    // if there was something selected
    if (selection[0] < selection[1]) {
      // select the new content
      textArea.selectionStart = selection[0] + (newTextObj.selectionStart || 0);
      textArea.selectionEnd = selection[0] + (newTextObj.selectionEnd || newTextObj.text.length);
    } else {
      // otherwise put the selection to a custom single caret
      textArea.selectionStart = selection[0] + newTextObj.defaultSelection;
      textArea.selectionEnd = selection[0] + newTextObj.defaultSelection;
    }

    // re-focus the textarea
    $(textArea).focus();
  };
};

var getHotkeyFn = function(targetButton) {
  return function() {
    targetButton.trigger('click');
    return false;
  };
};

var handleCommentBoxInserted = function(box) {
  if (box.find('.chrome-github-editor').length > 0) {
    return;
  }
  var content = box.find(
    // only visible comment areas (avoid the hidden one that will be clones)
    '.write-content:visible, ' +
    '.inline-comment-form-container.open .write-content, '+
    'form.js-comment-update'
  );
  $.get(chrome.extension.getURL('/template.html'))
    .done(function(template) {
      if (content.find('.chrome-github-editor').length > 0) {
        return;
      }
      // set up click listeners
      var bar = content.prepend(template);
      for (var l in listeners) {
        bar.find('.' + l).click(applyEvent(l));
      }
      // set up hotkeys
      var textArea = content.find('textarea');
      for (var fn in hotkeys) {
        for (var key in hotkeys[fn]) {
          textArea.on('keydown', null, hotkeys[fn][key], getHotkeyFn(bar.find('.' + fn)));
        }
      }
    });
};

var handleMultipleBoxesInserted = function(boxes) {
  boxes.each(function() {
    handleCommentBoxInserted($(this));
  });
};

// build an observer
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    var newNodes = mutation.addedNodes; // DOM NodeList
    if (newNodes !== null) { // If there are new nodes added
      var $nodes = $(newNodes);
      var $node = $nodes.find(
        '.previewable-comment-form, ' +     // regular comments (new replies)
        'div.comment-content'               // potential comment edits
      );
      if ($node.length > 0) {
        handleMultipleBoxesInserted($node);
      }
    }
  });
});

// Configuration of the observer:
var config = {
  childList: true,
  subtree: true
};

var init = function() {
  // watch the whole GitHub dynamic container
  var targets = $('.repo-container');
  // watch for comment forms additions
  targets.each(function(index, target) {
    // Pass in the target node, as well as the observer options
    observer.observe(target, config);
  });

  // register the comment forms pre-loaded in the page
  handleMultipleBoxesInserted($(
    '.previewable-comment-form, ' +     // regular comments (new replies)
    'div.comment-content'               // potential comment edits
  ));
};

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.type === 'init') {
      init();
    }
  }
);