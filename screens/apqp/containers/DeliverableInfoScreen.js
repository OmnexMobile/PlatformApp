import { connect } from "react-redux";
// Styles
import { DeliverableInfoScreen } from "./DeliverableInfoScreen1";

const mapStateToProps = (state) => {
  return {
    data: state,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeliverableInfoScreen);
