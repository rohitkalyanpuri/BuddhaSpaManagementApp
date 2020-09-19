import PropTypes from "prop-types";
import {connect} from "react-redux";
import {toastr} from 'react-redux-toastr';

const Alert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  // alerts.map(alert => (
  //   toastr.error (alert.alertType, alert.msg)
  // ));
  alerts.map((alert) => {
    if (alert.alertType === "error") {
      toastr.error(alert.alertType, alert.msg)
    }
    else if(alert.alertType === "success"){
      toastr.success(alert.alertType, alert.msg)
    }
    else if(alert.alertType==="warning"){
      toastr.warning(alert.alertType, alert.msg)
    }
    return true;
  });
Alert.propTypes = {
    alerts: PropTypes.array.isRequired
};
  
const mapStateToProps = state => ({
   alerts: state.alert
});

export default connect(mapStateToProps)(Alert);;