import { connect } from "react-redux";
// Styles
import { DeliverableInfoScreen } from "./DeliverableInfo";

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
