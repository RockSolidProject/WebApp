
import {Link} from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function Group({group}) {



    return (
        <div
            style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '12px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                backgroundColor: '#fafafa',
                cursor: 'pointer',
            }}
        >
            <Link to={`/groupDetail/${group._id}`}
                  style={{
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'block'
                  }}
            >
                <h2>{group.name}</h2>
                <h3>{group.isPrivate && `private group 🔒` || `public group 🔓`}</h3>
                {group.description && <p>description: {group.description}</p>}
            </Link>
        </div>

    )
}

export default Group;