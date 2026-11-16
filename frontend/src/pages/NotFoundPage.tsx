import { Link } from 'react-router-dom';
import { Screen } from '../components';

export function NotFoundPage() {
  return (
    <Screen className="not-found">
      <h1 className="big">That screen isn’t here.</h1>
      <Link to="/">Back home</Link>
    </Screen>
  );
}
