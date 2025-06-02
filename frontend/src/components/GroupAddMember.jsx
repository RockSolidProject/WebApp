import AsyncSelect from 'react-select/async';
import { Avatar, Typography, Box } from '@mui/material';

const limit = 5;
const backendUrl = import.meta.env.VITE_BACKEND_URL;

function GroupAddMember({ onUserSelect }) {
    async function loadOptions(inputValue) {
        try {
            const res = await fetch(`${backendUrl}/users?search=${inputValue}&limit=${limit}`);
            const data = await res.json();
            return data.map(user => ({
                value: user._id,
                label: user.username,
                avatar: user.avatar ? `${backendUrl}${user.avatar}` : null,
            }));
        } catch (err) {
            console.error("Error loading users:", err);
            return [];
        }
    }

    const formatOptionLabel = ({ label, avatar }) => (
        <Box display="flex" alignItems="center">
            <Avatar
                src={avatar || undefined}
                alt={label}
                sx={{ width: 28, height: 28, mr: 1 }}
            />
            <Typography variant="body2">{label}</Typography>
        </Box>
    );

    return (
        <Box mt={2}>
            <Typography variant="subtitle1" gutterBottom>
                Dodaj člana:
            </Typography>
            <AsyncSelect
                cacheOptions
                loadOptions={loadOptions}
                onChange={onUserSelect}
                placeholder="Poišči uporabnika..."
                formatOptionLabel={formatOptionLabel}
                styles={{
                    menu: base => ({ ...base, zIndex: 9999 }),
                }}
            />
        </Box>
    );
}

export default GroupAddMember;
