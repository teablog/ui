import React, { PureComponent } from 'react';
import { Picker } from 'emoji-mart';
import {
  ImageDropzone,
  FileUploadButton,
} from 'react-file-utils';
import "./messageInputSmall.css";
import 'emoji-mart/css/emoji-mart.css'


export default function MessageInputSmall({ send }) {

  const [emojiPickerIsOpen, setEmojiPickerIsOpen] = React.useState(false)
  const textareaRef = React.useRef(null)
  const emojiPickerRef = React.useRef(null)
  const [text, setText] = React.useState("")

  React.useEffect(() => {
    return () => {
      document.removeEventListener('click', closeEmojiPicker);
    }
  }, [])

  const closeEmojiPicker = (e) => {
    if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
      setEmojiPickerIsOpen(false)
      document.removeEventListener('click', closeEmojiPicker);
    }
  }

  const openEmojiPicker = () => {
    document.addEventListener('click', closeEmojiPicker)
    setEmojiPickerIsOpen(true)
  }

  const onSelectEmoji = (emoji) => insertText(emoji.native);

  const renderEmojiPicker = () => {
    if (emojiPickerIsOpen) {
      return (
        <div
          className="emojipicker"
          ref={emojiPickerRef}
        >
          <Picker
            native
            emoji="point_up"
            title="Pick your emoji…"
            onSelect={onSelectEmoji}
            color="#006CFF"
            showPreview={false}
          />
        </div>
      );
    }
  };

  const handleChange = (event) => {
    event.preventDefault();
    if (!event || !event.target) {
      return '';
    }
    const text = event.target.value;
    setText(text);
  };

  const handlerKeyDown = () => {
    if (event.key === 'Enter' && text.length > 0) {
      event.preventDefault();
      send(text);
      event.target.value = '';
      setText("")
    }
  }

  const insertText = (textToInsert) => {
    let newCursorPosition;
    let newText = "";
    const prevText = text;
    const textareaElement = textareaRef.current;

    if (!textareaElement) {
      setText(prevText + textToInsert);
      return
    }
    // Insert emoji at previous cursor position
    const { selectionStart, selectionEnd } = textareaElement;
    newCursorPosition = selectionStart + textToInsert.length;
    newText = prevText.slice(0, selectionStart) + textToInsert + prevText.slice(selectionEnd);
    setText(newText);

    if (!textareaElement || newCursorPosition == null) {
      return;
    }
    // Update cursorPosition
    textareaElement.selectionStart = newCursorPosition;
    textareaElement.selectionEnd = newCursorPosition;
    textareaElement.value = newText
    textareaElement.focus();
  };

  return (
    <div className="small-message-input wrapper">
      <ImageDropzone
      // accept={this.props.acceptedFiles}
      // multiple={this.props.multipleUploads}
      // disabled={
      //   this.props.numberOfUploads >= this.props.maxNumberOfFiles
      //     ? true
      //     : false
      // }
      // handleFiles={this.props.uploadNewFiles}
      >
        <div className="input">
          {renderEmojiPicker()}
          <div className="textarea-wrapper">
            <div className="textarea">
              <textarea rows="1" placeholder="Type your message" onChange={handleChange} onKeyPress={handlerKeyDown} ref={textareaRef} style={{ height: 41 }}></textarea>
            </div>
            <span
              className="emojiselect"
              onClick={openEmojiPicker}
            >
              <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M11.108 8.05a.496.496 0 0 1 .212.667C10.581 10.147 8.886 11 7 11c-1.933 0-3.673-.882-4.33-2.302a.497.497 0 0 1 .9-.417C4.068 9.357 5.446 10 7 10c1.519 0 2.869-.633 3.44-1.738a.495.495 0 0 1 .668-.212zm.792-1.826a.477.477 0 0 1-.119.692.541.541 0 0 1-.31.084.534.534 0 0 1-.428-.194c-.106-.138-.238-.306-.539-.306-.298 0-.431.168-.54.307A.534.534 0 0 1 9.538 7a.544.544 0 0 1-.31-.084.463.463 0 0 1-.117-.694c.33-.423.742-.722 1.394-.722.653 0 1.068.3 1.396.724zm-7 0a.477.477 0 0 1-.119.692.541.541 0 0 1-.31.084.534.534 0 0 1-.428-.194c-.106-.138-.238-.306-.539-.306-.299 0-.432.168-.54.307A.533.533 0 0 1 2.538 7a.544.544 0 0 1-.31-.084.463.463 0 0 1-.117-.694c.33-.423.742-.722 1.394-.722.653 0 1.068.3 1.396.724zM7 0a7 7 0 1 1 0 14A7 7 0 0 1 7 0zm4.243 11.243A5.96 5.96 0 0 0 13 7a5.96 5.96 0 0 0-1.757-4.243A5.96 5.96 0 0 0 7 1a5.96 5.96 0 0 0-4.243 1.757A5.96 5.96 0 0 0 1 7a5.96 5.96 0 0 0 1.757 4.243A5.96 5.96 0 0 0 7 13a5.96 5.96 0 0 0 4.243-1.757z"
                  fillRule="evenodd"
                />
              </svg>
            </span>
            <FileUploadButton
            // multiple={this.props.multipleUploads}
            // disabled={
            //   this.props.numberOfUploads >= this.props.maxNumberOfFiles
            //     ? true
            //     : false
            // }
            // accepts={this.props.acceptedFiles}
            // handleFiles={this.props.uploadNewFiles}
            >
              <span
                className="small-message-input-fileupload"
              // onClick={this.props.openFilePanel}
              >
                <svg
                  width="14"
                  height="14"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 .5c3.59 0 6.5 2.91 6.5 6.5s-2.91 6.5-6.5 6.5S.5 10.59.5 7 3.41.5 7 .5zm0 12c3.031 0 5.5-2.469 5.5-5.5S10.031 1.5 7 1.5A5.506 5.506 0 0 0 1.5 7c0 3.034 2.469 5.5 5.5 5.5zM7.506 3v3.494H11v1.05H7.506V11h-1.05V7.544H3v-1.05h3.456V3h1.05z"
                    fillRule="nonzero"
                  />
                </svg>
              </span>
            </FileUploadButton>
          </div>
        </div>
      </ImageDropzone>
    </div>
  );

}
