import React from 'react'
import MenuIcon from "@material-ui/icons/Menu"
import { IconButton } from '@material-ui/core'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'

function TempDrawer() {
    const [state, setState] = React.useState({
        left: false
    })

    const toggleDrawer = (anchor, open) => (event) => {
        setState({ ...state, [anchor]: open });
    };

    const list = (anchor) => (
        <div style={{ width: "250px" }} role="presentation">
            <List>
                <ListItem>
                    <ListItemText style={{ fontSize: "48px", marginLeft: "5px" }}>
                        <span style={{ color: "blue", fontWeight: "700", fontSize: "22px", fontFamily: "'Product Sans',Arial,sans-serif" }}> G </span>
                        <span style={{ color: "red", fontWeight: "500", fontSize: "22px", fontFamily: "'Product Sans',Arial,sans-serif" }}> o </span>
                        <span style={{ color: "yellow", fontWeight: "500", fontSize: "22px", fontFamily: "'Product Sans',Arial,sans-serif" }}> o </span>
                        <span style={{ color: "blue", fontWeight: "500", fontSize: "22px", fontFamily: "'Product Sans',Arial,sans-serif" }}> g </span>
                        <span style={{ color: "green", fontWeight: "500", fontSize: "22px", fontFamily: "'Product Sans',Arial,sans-serif" }}> l </span>
                        <span style={{ color: "red", fontWeight: "500", fontSize: "22px", fontFamily: "'Product Sans',Arial,sans-serif" }}> e </span>
                        <span style={{ color: "#5f6368", fontWeight: "500", fontSize: "22px", fontFamily: "'Product Sans',Arial,sans-serif", paddingLeft: "15px" }}> Docs </span>
                    </ListItemText>
                </ListItem>
            </List>
            <Divider />

            <List>

            </List>
        </div>
    )

    return (
        <React.Fragment>
            
            <IconButton onClick={toggleDrawer("left", true)}>
                <MenuIcon />
            </IconButton>

            <Drawer open={state['left']} onClose={toggleDrawer("left", false)} anchor={'left'}>
                {list('left')}
            </Drawer>
        </React.Fragment>
    )
}

export default TempDrawer