import AsyncSelect from 'react-select/async';

const limit = 5;
const backendUrl = import.meta.env.VITE_BACKEND_URL;
function GroupAddMember({ onUserSelect }) {
    async function loadOptions(inputValue) {
        const res = await fetch(`${backendUrl}/users?search=${inputValue}&limit=${limit}`);
        const data = await res.json();
        return data.map(user => ({ value: user._id, label: user.username }));
    }

    return (
        <>
            <div>neka neka</div>
            <AsyncSelect
                cacheOptions
                loadOptions={loadOptions}
                onChange={onUserSelect}
                placeholder="Search for a user..."
            />
        </>

    );
}

export default GroupAddMember;