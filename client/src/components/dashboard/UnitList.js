import React from "react";
import { connect } from "react-redux";
import shortid from "shortid";
import axios from "axios";

import AddUnit from "./AddUnit";
import { fetchUnit, fetchUser } from "../../actions";

import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListSubheader from "@material-ui/core/ListSubheader";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme) => ({
  smallAvatar: {
    backgroundColor: "#78909c",
    fontWeight: "bold",
    width: theme.spacing(3),
    height: theme.spacing(3),
    fontSize: "1em",
    color: "#fafafa",
  },
}));

function UnitList(props) {
  const classes = useStyles();

  function truncate(str) {
    if (str.length <= 12) {
      return str;
    }
    return str.slice(0, 12) + "...";
  }

  function renderUnits() {
    return props.user.units.map((unit) => {
      return (
        <ListItem
          button
          onClick={() => {
            props.fetchUnit(unit.name);
          }}
          key={shortid.generate()}
        >
          <ListItemIcon>
            <Avatar className={classes.smallAvatar} color="primary">
              {unit.name.charAt(0).toUpperCase()}
            </Avatar>
          </ListItemIcon>
          <ListItemText>{truncate(unit.name)}</ListItemText>
        </ListItem>
      );
    });
  }

  return (
    <div>
      <ListSubheader>UNITS</ListSubheader>
      {renderUnits()}
      <AddUnit type="list" />
    </div>
  );
}

function mapStateToProps(state) {
  return {
    user: state.auth.user,
  };
}

export default connect(mapStateToProps, { fetchUnit, fetchUser })(UnitList);
