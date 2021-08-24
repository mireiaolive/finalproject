export default function ProfilePic({ imageUrl }) {
    //console.log("see props from parent: ", props);

    //it shows image if we have, if not show a default
    imageUrl = imageUrl || "default.png";
    return (
        <div className="profile">
            <img className="img-profile" src={imageUrl} alt="Mireia Olive" />
        </div>
    );
}
