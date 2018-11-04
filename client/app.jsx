/* eslint-disable react/react-in-jsx-scope */
import React from "react";
import WebviewControls from "../messenger-api-helpers/webview-controls";
import UserStore from "../stores/user-store";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Switch from "@material-ui/core/Switch";
import Input from "@material-ui/core/Input";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

export default class App extends React.Component {
  state = { sortOption: "best_match", openSwitch: true, term: "restaurants" };

  componentDidMount = () => {
    if (this.props.userId) {
      let user = UserStore.get(this.props.userId);
      if (user) {
        let preferences = user.getPreferences();
        this.setState({
          sortOption: preferences.sortOption,
          openSwitch: preferences.checked,
          term: preferences.term
        });
      } else {
        UserStore.insert(this.props.userId);
      }
    }
  };

  handleSortChange = event => {
    this.setState({ sortOption: event.target.value });
  };

  handleOpenSwitch = event => {
    this.setState({ openSwitch: event.target.checked });
  };

  handleTermChange = event => {
    this.setState({ term: event.target.value });
  };

  handleSubmit = () => {
    WebviewControls.close();
  };

  render() {
    const { sortOption, openSwitch, term } = this.state;
    return (
      <div>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2">
              Options
            </Typography>
            <List>
              <ListItem>
                <Input value={term} onChange={this.handleTermChange} />
              </ListItem>
              <ListItem>
                <Select value={sortOption} onChange={this.handleSortChange}>
                  <MenuItem value="best_match">Best Match</MenuItem>
                  <MenuItem value="review_count">Most Reviewed</MenuItem>
                  <MenuItem value="distance">Distance</MenuItem>
                  <MenuItem value="rating">Rating</MenuItem>
                </Select>
              </ListItem>
              <ListItem>
                <ListItemText primary="Open Now" />
                <ListItemSecondaryAction>
                  <Switch
                    color="primary"
                    checked={openSwitch}
                    onChange={this.handleOpenSwitch}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </CardContent>
          <CardActions style={{ display: "flex" }}>
            <Button
              style={{ marginLeft: "auto" }}
              size="medium"
              color="primary"
              onClick={this.handleSubmit}
            >
              Done
            </Button>
          </CardActions>
        </Card>
      </div>
    );
  }
}
