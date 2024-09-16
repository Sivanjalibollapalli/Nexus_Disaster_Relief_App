document.addEventListener('DOMContentLoaded', () => {
    const sosBtn = document.querySelector('.sos-btn');
    const resourceButtons = document.querySelectorAll('.resource-btn');
    const mapIframe = document.getElementById('mapIframe');

    const locations = {
        guntur: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d61263.80386609409!2d80.4345186!3d16.323570600000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4a755cb1787785%3A0x9f7999dd90f1e694!2sGuntur%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1719741929890!5m2!1sen!2sin',
        vijayawada: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d61205.02240739431!2d80.6036847067607!3d16.51024305753492!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35eff9482d944b%3A0x939b7e84ab4a0265!2sVijayawada%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1719741962798!5m2!1sen!2sin',
        mangalagiri: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30614.667657485203!2d80.54905061934893!3d16.433282557871678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35f1384e2ccc41%3A0xedb08ef558b9912f!2sMangalagiri%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1719741988255!5m2!1sen!2sin',
        amaravathi: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15296.449633645136!2d80.34923241360015!3d16.57084861353299!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35915cb1b9dbcb%3A0xcbaa7b3fc3ba6553!2sAmaravathi%2C%20Andhra%20Pradesh%20522020!5e0!3m2!1sen!2sin!4v1719742008892!5m2!1sen!2sin'
    };

       resourceButtons.forEach(button => {
        button.addEventListener('click', () => {
            const location = button.getAttribute('data-location');
            mapIframe.src = locations[location];
        });
    });

    document.getElementById('home').addEventListener('click', () => {
        window.location.href = 'home.html';
    });

    document.getElementById('requestResources').addEventListener('click', () => {
        window.location.href = 'request_resources.html';
    });

    document.getElementById('realTimeMap').addEventListener('click', () => {
        window.location.href = 'real_time_map.html';
    });
});
document.getElementById('chat').addEventListener('click', () => {
    window.location.href = 'group_chat.html';
});
