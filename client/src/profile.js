import Bio from "./bio";

export default function Profile({ first, last, imageUrl, bio, setBio }) {
    return (
        <div className="profile-big">
            <div className="profile-pic">
                <img className="profile-pic" src={imageUrl} />
            </div>
            <div className="profile-bio">
                <p>
                    {first} {last}
                </p>
                <Bio bio={bio} setBio={setBio} />
            </div>
        </div>
    );
}
