import { useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { Icon, ICONS } from './Icon';

export function ScreenHeader() {
  const navigate = useNavigate();
  return (
    <div className="top">
      <Button className="icon-button close-button" variant="icon" onClick={() => navigate('/app')} aria-label="Back home">
        <Icon path={ICONS.close} />
      </Button>
    </div>
  );
}
