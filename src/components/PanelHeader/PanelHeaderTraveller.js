import React from "react";

class PanelHeaderTraveller extends React.Component {
  render() {
    return (
      <div
        className={
          "panel-header-traveller"
        }
      >
        {this.props.content}
      </div>
    );
  }
}

export default PanelHeaderTraveller;
