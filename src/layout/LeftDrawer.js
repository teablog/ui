import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import { Redis, Mysql, Chat, Golang, Elastic, Linux } from './icon'
// import HdIcon from '@material-ui/icons/Hd';
// import TvIcon from '@material-ui/icons/Tv';
 
const useStyles = makeStyles(theme=> ({
  header: {
    paddingLeft: 16
  },
  dycListItem: {
    padding: '0 0 0 9.6px',
    height: 42,
    color: '#3c4043',
    '&:hover': {
      background: 'inherit',
      color: '#1a73e8',
      '& svg': {
        color: '#1a73e8',
      }
    }
  },
  drawerPaper: {
    width: 180,
    [theme.breakpoints.up('sm')]: {
      width: 280,
    },
    backgroundColor: 'rgb(250,250,250)',
    borderRight: 'None',
    zIndex: 200
  },
  dycListItemIcon: {
    fontSize: 24,
    height: 24,
    width: 24,
    margin: '0 19.2px',
    color: '#80868b'
  },
  title: {
    fontSize: 16,
    color: "rgba(0,0,0,0.87)",
    marginLeft: 0,
    [theme.breakpoints.up('sm')]: {
      display: 'block',
      fontSize: 20,
      marginLeft:theme.spacing(2),
    }
  },

}));

function LeftDrawer(props) {
  const classes = useStyles();
  const isOpen = Boolean(props.isOpen);
  const toggleDrawer = props.toggleDrawer;

  const ListItemLink = (props) => {
    return <ListItem button component="a" {...props} target="_blank" />;
  }

  // const customize = [
  //   {
  //     name: '热点',
  //     icon: <FeaturedPlayList className={classes.dycListItemIcon} />,
  //     link: "/"
  //   },
  //   {
  //     name: '为您推荐',
  //     icon: <Person className={classes.dycListItemIcon} />,
  //     link: "/foryou"
  //   },
  //   {
  //     name: '收藏夹',
  //     icon: <BookmarkBorder className={classes.dycListItemIcon} />,
  //     link: "/my/library"
  //   },
  //   {
  //     name: '已保存的文章',
  //     icon: <Search className={classes.dycListItemIcon} />,
  //     link: "/my/bookmarks"
  //   }
  // ];

  const Topics = [
    // {
    //   name: 'Chat',
    //   icon: <Chat className={classes.dycListItemIcon} />,
    //   link: "/chat"
    // },
    {
      name: 'Redis',
      icon: <Redis className={classes.dycListItemIcon} />,
      link: "/topics/redis"
    },
    {
      name: 'Mysql',
      icon: <Mysql className={classes.dycListItemIcon} />,
      link: "/topics/mysql"
    },
    {
      name: 'Golang',
      icon: <Golang className={classes.dycListItemIcon} />,
      link: "/topics/golang"
    },
    {
      name: 'Elastic',
      icon: <Elastic className={classes.dycListItemIcon} />,
      link: "/topics/elasticsearch"
    },
    {
      name: 'Linux',
      icon: <Linux className={classes.dycListItemIcon} />,
      link: "/topics/linux"
    },
    // {
    //   name: 'Movie',
    //   icon: <HdIcon className={classes.dycListItemIcon} />,
    //   link: "/media/movie"
    // },
    // {
    //   name: 'TV',
    //   icon: <TvIcon className={classes.dycListItemIcon} />,
    //   link: "/media/tv"
    // },
  ]

  const sideList = side => (
    <div>
      <Toolbar className={classes.header}>
        <IconButton className={classes.menuButton} onClick={toggleDrawer()} aria-label="Open drawer">
          <MenuIcon style={{color: "rgba(0,0,0,0.87)"}}/>
        </IconButton>
        <a href="/">
          <h4 className={classes.title}>
            Douyacun
          </h4>
        </a>
      </Toolbar>

      {/* <List className={classes.dycList} style={{ marginTop: '19.2px' }}>
        {customize.map((item, index) => (
          <ListItemLink button key={index} href={item.link} className={classes.dycListItem}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText >
              <Typography variant="body2">
                {item.name}
              </Typography>
            </ListItemText>
          </ListItemLink>
        ))}
      </List> */}

      {/* <Divider style={{ margin: '14.4px 0 14.4px 19.2px' }} /> */}

      <List>
        {Topics.map((item, index) => (
          <ListItemLink button key={index} href={item.link} className={classes.dycListItem}>
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2">
                {item.name}
              </Typography>
            </ListItemText>
          </ListItemLink>
        ))}
      </List>
    </div>
  );

  return (
    <div>
      <Drawer
        open={isOpen}
        onClose={toggleDrawer()}
        variant={props.isWide ? "persistent" : "temporary"}
        classes={{
          paper: classes.drawerPaper,
        }}
        transitionDuration={200}
      >
        {sideList('left')}
      </Drawer>
    </div>
  );
}

export default LeftDrawer;