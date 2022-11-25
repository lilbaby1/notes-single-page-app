const Footer = ({ items }) => {

    return (
        <footer>
            <p>{items} List {items === 1 ? 'item' : 'items'}</p>
        </footer>
    )
}

export default Footer