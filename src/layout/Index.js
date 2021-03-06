import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles/colorManipulator';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import LeftDrawer from './LeftDrawer';
import Paper from '@material-ui/core/Paper';
import Account from './account';

const BIG_SCREEN_WIDTH = 1400;

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
  },
  grow: {
    flexGrow: 1,
  },
  title: {
    fontSize: 16,
    marginLeft: 0,
    [theme.breakpoints.up('sm')]: {
      display: 'block',
      fontSize: 20,
      marginLeft: theme.spacing(2),
    },
  },
  hidden: {
    [theme.breakpoints.down('sm')]: {
      display: 'none !important'
    },
  },
  filler: {
    height: 48,
    width: 130,
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'block',
    },
  },
  wc: {
    height: 48,
    verticalAlign: 'center',
    whiteSpace: 'nowrap',
    alignItems: 'center',
    display: 'flex',
  },
  fullWidth: {
    flex: '1 1 100%',
    justifyContent: "center"
  },
  search: {
    position: 'relative',
    borderRadius: 8,
    backgroundColor: "#f1f3f4",
    border: "2px solid #f1f3f4",
    marginRight: theme.spacing(2),
    marginLeft: 0,
    maxWidth: 480,
    flex: '1 1 auto',
    display: 'flex',
    height: 36,
    marginLeft: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      width: 'auto',
      height: 48,
      maxWidth: 720,
    },
  },
  searchFocus: {
    backgroundColor: fade(theme.palette.common.white, 1),
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    [theme.breakpoints.down('md')]: {
      width: 200,
    },
  },
  inputRoot: {
    color: 'inherit',
    height: "100%",
    width: '100%',
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  container: {
    width: "100%",
    height: "100%"
  },
  button: {
    textTransform: "none"
  },
  marginLeft: {
    marginLeft: 280,
  },
  marginLeftTranslation: {
    transition: "margin-left 200ms"
  }
}));


function Layout({ children, leftDrawerDefaultDisplay = false, marginTop = true }) {
  const classes = useStyles();
  const [wideEl, setWideEl] = React.useState(null); // 判断屏幕是否为宽屏
  const [drawerStat, setDrawerStat] = React.useState(true);// leftDrawer

  const isDrawerOpen = Boolean(drawerStat);
  const isWide = Boolean(wideEl);
  const [firstLoad, setFirstLoad] = React.useState(0);// 大屏第一次加载显示左侧边框

  React.useEffect(() => {
    updateSize()
  }, []);

  React.useEffect(() => {
    // 监听窗口变化
    window.addEventListener('resize', updateSize);
    let clientWidth = document.documentElement.clientWidth;
    let open = clientWidth >= BIG_SCREEN_WIDTH;
    setWideEl(open);
    if (leftDrawerDefaultDisplay && firstLoad == 0 && open) {
      setDrawerStat(true);
      setFirstLoad(1);
    }
    // setCook(parseCookies());
    return function cleanup() {
      window.removeEventListener('resize', updateSize)
    };
  });

  const updateSize = () => {
    // 响应式处理
    const clientWidth = document.documentElement.clientWidth;

    if (clientWidth <= BIG_SCREEN_WIDTH) {
      setWideEl(false);
      if (isDrawerOpen) {
        setDrawerStat(false);
      }
    } else {
      if (!isDrawerOpen) {
        setDrawerStat(true);
      }
    }
  };
  const toggleDrawer = (open) => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerStat(open);
  };
  const onSearch = (event) => {
    let content = event.target.value;
    if (event.key === 'Enter' && content.length > 0) {
      window.location.href = `/search/articles?q=${content}`
    }
  }

  return (
    <dyc-app className={classes.root} open-and-visible={isWide && isDrawerOpen ? "true" : "false"}>
      <header className={classes.grow}>
        <AppBar position="fixed" component="div" style={{ zIndex: 1000 }}>
          <Toolbar>
            <div className={classes.wc}>
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                aria-label="Open drawer"
                onClick={toggleDrawer(!isDrawerOpen)}
              >
                <MenuIcon />
              </IconButton>
              <Typography className={classes.title + ' ' + classes.hidden} variant="h2" noWrap>
                <a href="/" style={{ color: "#666" }}>Douyacun</a>
              </Typography>
            </div>
            <div className={classes.wc + ' ' + classes.fullWidth}>
              <div className={classes.search}>
                <div className={classes.container}>
                  <div className={classes.searchIcon}>
                    <SearchIcon />
                  </div>
                  <InputBase
                    classes={{
                      input: classes.inputInput,
                      root: classes.inputRoot
                    }}
                    onKeyPress={onSearch}
                    placeholder="搜索..."
                  />
                </div>
              </div>
            </div>
            <div className={classes.filler}></div>
            <div className={classes.wc + ' ' + classes.hidden}>
              <Account />
            </div>
          </Toolbar>
        </AppBar>
        <LeftDrawer isOpen={isDrawerOpen} toggleDrawer={() => toggleDrawer(false)} isWide={isWide} />
        {
          marginTop ? (<div style={{ height: '64px' }}></div>) : ""
        }
      </header>
      <Paper square={true} elevation={0}>
        {children}
      </Paper>
    </dyc-app>
  );
}

export default Layout;