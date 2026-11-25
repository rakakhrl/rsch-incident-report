interface IProps {
  element?: any;
}

function PrivateRoute(props: IProps) {
  return <>{props.element}</>;
}

export default PrivateRoute;
