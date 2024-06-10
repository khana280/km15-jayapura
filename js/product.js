
        async function getProductCategories() {
            const response = await fetch("../datajson/categories.json");
            const data = await response.json();

            let html = `<div class="product-card">
                    <a href="" class="image-container">
                        <h2 class="absolute" style="color: black; font-weight: bold;">All</h2>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/20/NBC_Superstore.png" alt="Product Image" class="product-img">
                    </a>
                </div>`;
            html += data.data
                .map((item) => {
                    return ` <div class="product-card">
                                <a href="#${item.category}" class="image-container" onclick="getProducts('${item.category}')">
                                    <h2 class="absolute">${item.category}</h2>
                                    <img src="${item.image}" alt="Product Image" class="product-img">
                                </a>
                            </div>`;
                })
                .join("");
            document.getElementById("product-categories").innerHTML = html;
        }

        const getAllSubCategories = async () => {
            const response = await fetch("../datajson/categories.json");
            const data = await response.json();
            let html = `<a href="" class="badge">All</a>`;
            html += data.data
                .map((item) => {
                    return item.sub_category
                        .map((subItem) => {
                            return ` <a href="#${subItem.name}" class="badge" onclick="showAllProducts('${subItem.name}')">${subItem.name}</a>`;
                        })
                        .join("");
                })
                .join("");
            document.getElementById("sub-categories-choiced").innerHTML = html;
        };

        async function getProducts(category) {
            const categories = document.querySelectorAll(".product-card a");
            categories.forEach((item) => {
                item.classList.remove("product-active");
            });
            document
                .querySelector(`a[href="#${category}"]`)
                .classList.add("product-active");
            subCategoris(category);
        }

        const subCategoris = async (category) => {
            const response = await fetch("../datajson/categories.json");
            const data = await response.json();
            const products = data.data.filter((item) => item.category === category);
            if (products.length === 0) {
                return;
            }
            let html = `<a href="" class="badge">All</a>`
            html += products[0].sub_category
                .map((item) => {
                    return ` <a href="#${item.name}" class="badge" onclick="showAllProducts('${item.name}')">
    ${item.name}
    </a>`;
                })
                .join("");

            const element = document.getElementById("sub-categories-choiced");
            element.innerHTML = html;
        };

        const showAllProducts = async (filter = null) => {
            console.log(filter);
            const response = await fetch("../datajson/products.json");
            let data = await response.json();
            if (filter) {
                data = data.data.filter((item) => item.sub_category === filter);
                if (data.length === 0) {
                    return;
                }
                data.data = data;
            }

            const html = data.data
                .map((item) => {
                    return `  <div class="border card-product">
                    <div class="product-image" style="display: flex; justify-content: center; align-items: center; height: 150px; overflow: hidden;">
                        <img src="${item.image != "" ? item.image : "img/revou.png"}" alt="Product Image"
                            style="width: 100%; height: auto; object-fit: cover;">
                    </div>
                    <div>
                        <h4 class="title-products">${item.product_name}</h4>
                        <h5>${item.category}</h5>
                        <h6>${item.sub_category}</h6>
                        <p style="font-size: 13px;">Price: $${item.price}</p>
                    </div>
                    <button class="btn-buy" onclick="showProductDetails('${item.image}', '${item.product_name}', '${item.sub_category}', '${item.price}', '${item.description}')">Detail Product</button>
                </div>`;
                })
                .join("");
            document.getElementById("products-show").innerHTML = html;
        };

        const showProductDetails = (image, name, sub_category, price, description) => {
            const modal = document.getElementById("productModal");
            const modalImage = document.getElementById("modalImage");
            const modalProductName = document.getElementById("modalProductName");
            const modalSubCategory = document.getElementById("modalSubCategory"); // Disesuaikan di sini
            const modalProductPrice = document.getElementById("modalProductPrice");
            const modalDescription = document.getElementById("modalDescription");
        
            modalImage.src = image;
            modalProductName.textContent = name;
            modalSubCategory.textContent = sub_category;
            modalProductPrice.textContent = `Price: $${price}`;
            modalDescription.textContent = description;
        
            modal.style.display = "block";
        };
        
        // Close the modal when the user clicks on <span> (x)
        const closeModal = () => {
            const modal = document.getElementById("productModal");
            modal.style.display = "none";
        };

        document.querySelector(".close").addEventListener("click", closeModal);

        // Close the modal when the user clicks anywhere outside of the modal
        window.onclick = function(event) {
            const modal = document.getElementById("productModal");
            if (event.target == modal) {
                modal.style.display = "none";
            }
        };

        // Call the functions to initialize the page
        showAllProducts();
        getAllSubCategories();
        getProductCategories();