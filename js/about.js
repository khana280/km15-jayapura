async function fetchStudentData() {
    document.getElementById('layer').style.display = 'block';
    const data = await fetch('../datajson/about.json');
    const response = await data.json();
    const html = response.data.map((item) => {
    return `<div class="col-3">
                    <div class="flex justify-content-center">
                        <div class="card">
                            <div class="card-body">
                                <div class="card-image" style="position: relative;">
                                    <div class="logo-kampus">
                                        <img src="img/revou.png" alt="Logo">
                                    </div>
                                <div class="${item.gender == 'male' ? 'logo-position-male' : 'logo-position-female'}">
                                        <img src="${item.logo_position}" alt="Logo">
                                </div>
                                    <img src="${item.image}" alt="Foto" style="width: 100%; height: 100%;">
                                </div>
                                <div class="card-text">
                                    <h4>${item.name}</h4>
                                    <p>${item.university}</p>
                                    <div class="flex social-media-1">
                                        <a href="${item.social_media.instagram}" target="_blank">
                                            <i class="bx bxl-instagram"></i>
                                        </a>
                                        <a href="${item.social_media.facebook}" target="_blank">
                                            <i class="bx bxl-facebook"></i>
                                        </a>
                                        <a href="${item.social_media.linkedin}" target="_blank">
                                            <i class="bx bxl-linkedin"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>`;
    }).join('');
    document.getElementById('layer').style.display = 'none';
    document.getElementById('about-card').innerHTML = html;
}

fetchStudentData();  