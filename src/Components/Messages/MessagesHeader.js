import React from "react";
import { Header, Segment, Input, Icon } from "semantic-ui-react";

const MessagesHeader = () => {
  return (
    <Segment clearing>
      <Header fluid="true" as="h2" floated="left">
        <span>
          Channel
          <Icon name="star outline" color="black" />
        </span>
        <Header.Subheader>2 Users</Header.Subheader>
      </Header>
      {/* channel title */}
      <Header floated="right">
        <Input
          size="mini"
          type="text"
          icon="search"
          name="searchTerm"
          placeholder="Search Messages"
        />
      </Header>
    </Segment>
  );
};

export default MessagesHeader;
