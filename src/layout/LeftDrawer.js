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
import { Redis, Mysql, Golang, Elastic, Linux, Tools, Kafka, Rct } from './icon'
import Divider from '@material-ui/core/Divider';
import WS from '../../src/components/ws';

const useStyles = makeStyles(theme => ({
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
      marginLeft: theme.spacing(2),
    }
  },

}));

function LeftDrawer(props) {
  const classes = useStyles();
  const isOpen = Boolean(props.isOpen);
  const toggleDrawer = props.toggleDrawer;
  const [online, setOnline] = React.useState(1)
  const ListItemLink = (props) => {
    return <ListItem button component="a" {...props} target="_blank" />;
  }
  const customize = [
    {
      name: '当前在线人数：' + online,
      icon: "",
      link: ""
    },
    // {
    //   name: '为您推荐',
    //   icon: <Person className={classes.dycListItemIcon} />,
    //   link: "/foryou"
    // },
    // {
    //   name: '收藏夹',
    //   icon: <BookmarkBorder className={classes.dycListItemIcon} />,
    //   link: "/my/library"
    // },
    // {
    //   name: '已保存的文章',
    //   icon: <Search className={classes.dycListItemIcon} />,
    //   link: "/my/bookmarks"
    // }
  ];

  const Topics = [
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
    {
      name: 'Kafka',
      icon: <Kafka className={classes.dycListItemIcon} />,
      link: "/topics/kafka"
    },
    {
      name: 'React',
      icon: <Rct className={classes.dycListItemIcon} />,
      link: "/topics/react"
    },
    {
      name: 'Tools',
      icon: <Tools className={classes.dycListItemIcon} />,
      link: "/topics/tools"
    },
  ];

  let ws_address;
  if (process.env.NEXT_PUBLIC_PROTOCOL == "https") {
    ws_address = "wss://" + process.env.NEXT_PUBLIC_HOSTNAME + "/api/ws/join"
  } else {
    ws_address = "ws://" + process.env.NEXT_PUBLIC_HOSTNAME + "/api/ws/join"
  }
  const sideList = side => (
    <div>
      <Toolbar className={classes.header}>
        <IconButton className={classes.menuButton} onClick={toggleDrawer()} aria-label="Open drawer">
          <MenuIcon style={{ color: "rgba(0,0,0,0.87)" }} />
        </IconButton>
        <a href="/">
          <h4 className={classes.title}>
            Douyacun
          </h4>
        </a>
      </Toolbar>
      <List>
        {Topics.map((item, index) => (
          <ListItemLink button key={index} rel="nofllow" href={item.link} className={classes.dycListItem}>
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
      <Divider style={{ margin: '0px 19.2px' }} />
      <List className={classes.dycList}>
        {customize.map((item, index) => {
          let hasIcon = Boolean(item.icon)
          return (
            <ListItemLink button key={index} href={item.link} className={classes.dycListItem}>
              {
                hasIcon ? (<ListItemIcon>{item.icon}</ListItemIcon>) : ""
              }
              <ListItemText style={{ paddingLeft: 24 }}>
                <Typography variant="body2">
                  {item.name}
                </Typography>
              </ListItemText>
            </ListItemLink>
          )
        })}
      </List>
      <WS ws_address={ws_address} setOnline={setOnline} />
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