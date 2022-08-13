import React from "react";
import { Nav } from "shards-react";

import SidebarNavItem from "./SidebarNavItem";
import { Constants, Store } from "../../../flux";

const iconWrapper = {
  minWidth: '1.25rem',
  fontSize: '90%',
  textAlign: 'center',
  verticalAlign: 'middle',
  willChange: 'color',
  color: '#CACEDB',
  marginRight: '0.375rem',
};
const iconStyle = {
  padding: '4px',
};
const padding = {
  fontWeight: '400',
  color: '#3d5170',
  padding: '0.9375rem 1.5625rem',
}
const spanStyle = {
  fontSize: '0.85rem',
  marginTop: '0.1rem',
  padding: '4px',
  fontWeight: '400',
  color: '#3d5170',
}
class SidebarNavItems extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      navItems: Store.getSidebarItems()
    };

    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    Store.addChangeListener(Constants.CHANGE, this.onChange);
  }

  componentWillUnmount() {
    Store.removeChangeListener(Constants.CHANGE, this.onChange);
  }

  onChange() {
    this.setState({
      ...this.state,
      navItems: Store.getSidebarItems()
    });
  }

  render() {
    const { navItems: items } = this.state;
    return (
      <div className="nav-wrapper">
        <Nav className="nav--no-borders flex-column">
          {items.map((item, idx) => (
            <SidebarNavItem key={idx} item={item} />
          ))}
        </Nav>
        <footer className="main-footer fixed-bottom d-flex p-2 px-3 bg-white border-top">
          <div style={padding}>
            <div
              className="d-inline-block item-icon-wrapper size-display"
              style={iconWrapper}
            ><img
                style={iconStyle}
                src={require("../../../images/icons/settings.svg")}
                alt="Shards Dashboard"
              />
              <span style={spanStyle}>2.6 MB used</span>
            </div>
          </div>
        </footer>
      </div>
    )
  }
}

export default SidebarNavItems;
