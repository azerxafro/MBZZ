
import { Lock } from 'lucide-react';

const Footer = () => {
  return (
    <div className="footer">
      <span>BUILD 2.077.01</span>
      <span>NEURAL LINK: STABLE</span>
      <span>DATA SECURE <Lock className="lock-icon" size={12} /></span>
    </div>
  );
};

export default Footer;
