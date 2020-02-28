import React from "react";
import { Header, Segment, Input, Icon } from "semantic-ui-react";

const MessagesHeader = ({ channelName, userAmount, handleChange }) => {
  return (
    <Segment clearing>
      <Header fluid="true" as="h2" floated="left">
        <span>
          {channelName}
          <Icon name="star outline" color="black" />
        </span>
        <Header.Subheader>{userAmount}</Header.Subheader>
      </Header>
      <Header floated="right">
        <Input
          size="mini"
          type="text"
          icon="search"
          name="searchTerm"
          placeholder="Search Messages"
          onChange={handleChange}
        />
      </Header>
    </Segment>
  );
};

export default MessagesHeader;
