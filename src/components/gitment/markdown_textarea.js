import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import ToolbarController from './toolbar_controller';
import Textarea from 'react-textarea-autosize';
import octicons from 'octicons';
import Button from '@material-ui/core/Button';
import MarkdownIt from 'markdown-it';


const insert = (state, selection, actionData) => {
  const newSelection = {};
  const newState = {};

  if (actionData.key && actionData.key === state.lastKey) {
    // If the user clicks twice in the same button, undo the action
    const diff = state.value.length - state.lastValue.length;
    newSelection.start = selection.start - (diff / 2);
    newSelection.end = selection.end - (diff / 2);
    newState.value = state.lastValue;
    newState.lastKey = null;
  } else {
    const mtc = new ToolbarController();
    newState.lastValue = state.value;
    newState.lastKey = actionData.key;
    newState.value = mtc.render(actionData, selection.start, selection.end, state.value);
    newSelection.start = mtc.selectionStart;
    newSelection.end = mtc.selectionEnd;
  }
  return { newState, newSelection };
};

const renderIcon = (name, options = { class: 'MarkdownTextarea-icon' }) => (
  <span dangerouslySetInnerHTML={{ __html: octicons[name].toSVG(options) }} />
)

const actions = [
  {
    type: 'delimiter',
  },
  {
    content: 'B',
    props: { 'aria-label': 'Add bold text' },
    content: renderIcon('bold'),
    execute(state, selection) {
      return insert(state, selection, { key: 'bold', prefix: '**', suffix: '**' });
    },
  }, {
    content: 'I',
    props: { 'aria-label': 'Add italic text' },
    content: renderIcon('italic'),
    execute(state, selection) {
      return insert(state, selection, { key: 'italic', prefix: '_', suffix: '_' });
    },
  }, {
    content: 'QUOTE',
    content: renderIcon('quote'),
    props: { 'aria-label': 'Insert a quote' },
    execute(state, selection) {
      return insert(state, selection, { prefix: '> ', multiline: true });
    },
  }, {
    content: 'URL',
    props: { 'aria-label': 'Add a link' },
    content: renderIcon('link'),
    execute(state, selection) {
      return insert(state, selection, { key: 'url', prefix: '[', suffix: '](url)' });
    },
  }, {
    content: 'UL',
    props: { 'aria-label': 'Add a bulleted list' },
    content: renderIcon('list-unordered'),
    execute(state, selection) {
      return insert(state, selection, { prefix: '- ', multiline: true });
    },
  }, {
    content: 'OL',
    props: { 'aria-label': 'Add a numbered list' },
    content: renderIcon('list-ordered'),
    execute(state, selection) {
      return insert(state, selection, { prefix: '1. ', multiline: true });
    },
  },
];

const styles = theme => ({
  comment_form_head: {
    background: '#f6f8fa',
    borderRadius: '3px 3px 0 0',
    padding: '6px 10px 0',
    marginBottom: 10,
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  comment_body: {
    minHeight: 131,
    backgroundColor: "transparent",
    borderBottom: "1px solid #e1e4e8",
    padding: "6px 8px 8px 8px",
  },
  preview_content: {
    margin: "0 8px 8px"
  },
  tabnav_tabs: {
    marginBottom: -1,
  },
  tabnav_tab: {
    backgroundColor: 'transparent',
    border: '1px solid transparent',
    borderBottom: 0,
    color: '#586069',
    display: 'inline-block',
    fontSize: 14,
    padding: '8px 12px',
    textDecoration: 'none',
    "&:focus": {
      outline: "none"
    }
  },
  selected: {
    backgroundColor: '#fff',
    borderColor: '#d1d5da',
    borderRadius: '3px 3px 0 0',
    color: '#24292e'
  },
  markdown_editor: {
    display: "block",
    maxHeight: 500,
    minHeight: 100,
    padding: 8,
    resize: 'vertical',
    width: "100%",
    borderBottom: "1px dashed #dfe2e5",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: '#fff',
    backgroundPosition: 'right 8px center',
    backgroundRepeat: 'no-repeat',
    border: '1px solid #d1d5da',
    borderRadius: '3px',
    boxShadow: 'inset 0 1px 2px rgba(27,31,35,.075)',
    color: '#24292e',
    fontSize: 14,
    outline: 'none',
    padding: '6px 8px',
    verticalAlign: 'middle',
  },
  focus: {
    borderColor: '#2188ff!important',
    boxShadow: 'inset 0 1px 2px rgba(27,31,35,.075), 0 0 0 0.2em rgba(3,102,214,.3)',
  },
  toolBarItem: {
    background: "none",
    border: 0,
    color: '#586069',
    cursor: 'pointer',
    display: 'block',
    float: 'left',
    padding: 4,
  },
  inputContrast: {
    backgroundColor: '#fafbfc',
  },
  write_content: {
    margin: '0 8px 8px',
    position: 'relative',
  },
  drag_and_drop: {
    backgroundColor: "#fafbfc",
    border: '1px solid #c3c8cf',
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    borderTop: 0,
    color: '#586069',
    fontSize: 13,
    margin: 0,
    padding: '7px 10px',
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between'
  },
  manual_file_chooser: {
    cursor: 'pointer',
    opacity: 0.01,
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    width: '100%'
  },
  tooltipped: {
    position: 'relative'
  },
  form_actions: {
    padding: `0 8px 8px`
  },
  comment: {
    float: 'right',
    borderColor: "rgba(27,31,35,.2)",
    boxShadow: "none",
    textTransform: "Capitalize",
    fontWeight: 600,
  },
  comment_disable: {
    color: "hsla(0,0%,100%,.75)!important",
    backgroundColor: "#94d3a2",
    backgroundImage: 'none',
  },
  to_comment: {
    backgroundColor: '#28a745',
    backgroundImage: 'linear-gradient(-180deg,#34d058,#28a745 90%)',
    color: '#fff',
    "&:hover": {
      backgroundColor: "#269f42",
      backgroundImage: "linear-gradient(-180deg,#2fcb53,#269f42 90%)",
      backgroundPosition: "-.5em",
      borderColor: "rgba(27,31,35,.5)",
    }
  }
});

const markdown = new MarkdownIt();

class MarkdownTextarea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      writing: true,
      focused: false,
      value: (props.value||'').replace(/\r\n/g, '\n'),
    };
  }
  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside, true);
  }
  componentWillUnmount() {
    if (this.state.writing) {
      document.removeEventListener('click', this.handleClickOutside, true);
    }
  }
  enableWrite = () => {
    this.setState({ writing: true });
  }
  enablePreview = () => {
    this.setState({ writing: false });
  }
  handleChange = (e) => {
    this.setState({ value: e.target.value, lastKey: null });
    this.props.onChange(e.target.value);
  }
  handleClear = () => {
    this.setState({ value: "", lastKey: null });
  }
  handleFocus = () => {
    this.setState({ focused: true });
  }
  handleClickOutside = (e) => {
    if (this.state.focused && !this.node.contains(e.target)) {
      this.setState({ writing: true, focused: false });
    }
  }
  handleClickAction(action) {
    if (!this.state.writing) {
      return;
    }
    const { newState, newSelection } = action.execute(this.state, {
      start: this.textarea.selectionStart,
      end: this.textarea.selectionEnd,
    });
    this.textarea.focus();
    this.textarea.setSelectionRange(0, this.textarea.value.length);
    if (!/firefox/i.test(navigator.userAgent)) {
      document.execCommand('insertText', false, newState.value);
    }
    this.setState(newState, () => {
      this.textarea.setSelectionRange(newSelection.start, newSelection.end);
    });
  }
  handlerComment = () => {
    let result = this.props.onComment()
    if (result) {
      this.setState({ value: "", lastKey: null });
    }
  }
  renderToolbar() {
    const { classes, isLogin } = this.props
    const writeButtonClass = classes.tabnav_tab + ' ' + (this.state.writing ? classes.selected : "")
    const previewButtonClass = classes.tabnav_tab + ' ' + (!this.state.writing ? classes.selected : "")
    const _actions = actions.map((action, index) => {
      if (action.type === 'delimiter') {
        return (
          <div key={`delimiter-${index}`} className={classes.toolBarItem} />
        );
      }
      return (
        <button key={`action-${index}`}
          {...action.props}
          onClick={this.handleClickAction.bind(this, action)}
          className={classes.toolBarItem}
        >
          {action.content}
        </button>
      );
    });
    return (
      <React.Fragment>
        <div className={classes.comment_form_head}>
          <nav className={classes.tabnav_tabs}>
            <button className={writeButtonClass} onClick={this.enableWrite}>Write</button>
            <button className={previewButtonClass} onClick={this.enablePreview}>Preview</button>
          </nav>
          <div className={classes.toolbar_commenting}>
            {this.state.writing && _actions}
          </div>
        </div>
      </React.Fragment>
    );
  }

  render() {
    const minHeight = this.textarea ? this.textarea.offsetHeight : 135;
    const { focused, writing, value } = this.state
    const isActive = this.props.toolbarAlwaysVisible || focused;

    const { classes, isLogin } = this.props;
    const commentClass = classes.comment + ' ' + (value ? classes.to_comment : classes.comment_disable)
    return (
      <div ref={(node) => { this.node = node; }}>
        {isActive && this.renderToolbar()}
        <div className={classes.write_content}>
          <Textarea
            // disabled={!isLogin()}
            inputRef={(textarea) => { this.textarea = textarea; }}
            style={{ display: writing ? 'block' : 'none' }}
            className={classes.markdown_editor + ' ' + classes.inputContrast + ' ' + (focused ? classes.focus : "")}
            placeholder="Leave a comment"
            onFocus={this.handleFocus}
            onChange={this.handleChange}
            value={value}
          />
          {writing && (
            <p className={classes.drag_and_drop + ' ' + (focused ? classes.focus : "")}>
              <input accept=".gif,.jpeg,.jpg,.png,.docx,.gz,.log,.pdf,.pptx,.txt,.xlsx,.zip" className={classes.manual_file_chooser} type="file" multiple="" />
              <span>
                Attach files by dragging &amp; dropping, selecting or pasting them.
                  </span>
              <span className={classes.tooltipped}>
                <a href="https://guides.github.com/features/mastering-markdown/" target="_blank" rel="nofollow"><span>{renderIcon('markdown', { class: 'MarkdownTextarea-help-icon' })}</span></a>
              </span>
            </p>
          )}
        </div>
        {!writing && (
          <div className={classes.preview_content}>
            <div
              dangerouslySetInnerHTML={{ __html: markdown.render(value) }}
              className={classes.comment_body + " markdown-body"}
              style={{ minHeight: minHeight }}
            />
          </div>
        )}
        <div className={classes.form_actions}>
          <Button disabled={value ? false : true} className={commentClass} onClick={this.handlerComment} disableRipple>
            Comment
          </Button>
          <div style={{ clear: "both" }} />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(MarkdownTextarea);