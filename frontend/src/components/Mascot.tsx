interface MascotProps {
  size?: number;
  happy?: boolean;
}

export function Mascot({ size = 64, happy = false }: MascotProps) {
  return (
    <div className={`mascot${happy ? ' happy' : ''}`} style={{ width: size, height: size }} aria-label="Shykey mascot">
      <i className="eye" />
      <i className="eye" />
      <i className="mouth" />
    </div>
  );
}
