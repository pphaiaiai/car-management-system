import { Button, Result } from 'antd';
import { Link } from 'react-router';

export function NotFoundPage() {
  return (
    <Result
      status="404"
      title="Page not found"
      subTitle="The page you are looking for does not exist."
      extra={
        <Link to="/cars">
          <Button type="primary">Back to car list</Button>
        </Link>
      }
    />
  );
}
