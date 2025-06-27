document.addEventListener("DOMContentLoaded", function() {
    // 카테고리 및 타입 선택 관련 로직
    const categorySelect = document.querySelector(".select_category");
    const typeSelect = document.querySelector(".select_type");
    const modelCheckboxes = document.querySelectorAll(".model-checkbox");
    const stockItems = document.querySelectorAll(".stock-item");

    const productTypes = {
        "PHONE_CASE": ["HARD", "JELLY", "CARD", "ZFLIP"],
        "TOK": ["ROUND", "HEART", "ACRYLIC"],
        "AIRPODS": ["AIRPODS_1_2", "AIRPODS_PRO", "AIRPODS_3", "BUDS"],
        "DIGITAL": ["APPLE_WATCH"]
    };

    // 선택된 카테고리에 따라 타입 옵션을 업데이트하는 함수
    function updateTypeOptions() {
        const selectedCategory = categorySelect.value;
        const types = productTypes[selectedCategory] || [];

        typeSelect.innerHTML = types.map(type => `<option value="${type}">${type}</option>`).join("");
    }

    if (categorySelect && typeSelect) {
        // 초기 호출을 통해 기본 카테고리에 따른 옵션 설정
        updateTypeOptions();

        // 카테고리 선택 변경 시 이벤트 리스너 설정
        categorySelect.addEventListener("change", updateTypeOptions);
    } else {
        console.error("카테고리 선택 요소 또는 타입 선택 요소를 찾을 수 없습니다");
    }


    // 체크박스 상태에 따라 재고 입력 필드를 토글하는 함수
    function toggleStockInput(checkbox, stockItem) {
        if (checkbox.checked) {
            stockItem.style.display = 'flex';
        } else {
            stockItem.style.display = 'none';
            const input = stockItem.querySelector("input[type='number']");
            input.value = 0; // 체크 해제 시 수량을 0으로 설정
        }
        updateSellStatus(); // 체크박스 상태 변경 시 판매 상태 업데이트
    }

    // 각 체크박스에 대해 초기 상태 설정 및 이벤트 리스너 추가
    modelCheckboxes.forEach((checkbox, index) => {
        const stockItem = stockItems[index];

        // 초기 상태 설정
        toggleStockInput(checkbox, stockItem);

        checkbox.addEventListener("change", function() {
            toggleStockInput(checkbox, stockItem);
        });
    });

    // 재고 입력값 변경 시 판매 상태 업데이트
    const stockInputs = document.querySelectorAll('.stock-input');
    stockInputs.forEach(function(input) {
        input.addEventListener('input', function() {
            if (this.value < 1) {
                this.value = 0; // 재고 0으로 설정
            }
            updateSellStatus();
        });
    });

    // 판매 상태 업데이트 함수
    const sellStatusSelect = document.getElementById('productSellStatus');

    function updateSellStatus() {
        let allStocksZero = true;
        stockInputs.forEach(function(input) {
            if (parseInt(input.value, 10) > 0) {
                allStocksZero = false;
            }
        });
        if (allStocksZero) {
            sellStatusSelect.value = 'SOLD_OUT';
        } else {
            sellStatusSelect.value = 'SELL';
        }
    }

    // 페이지 로드 시 초기 판매 상태 업데이트
    updateSellStatus();

    // 이미지 처리
    let fileIndex = 0;
    const fileList = new DataTransfer(); // 데이터 전송 객체를 생성하여 파일 목록 관리

    function handleFiles(files) {
        console.log("handleFiles 함수 호출됨, 파일들:", files);
        const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/bmp', 'image/png', 'image/gif'];
        const previewContainer = document.getElementById('preview-images');

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            if (!allowedFileTypes.includes(file.type)) {
                alert('이미지 파일 형식은 jpg, jpeg, bmp, png, gif 만 가능합니다.');
                continue;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                const filePreview = document.createElement('div');
                filePreview.className = 'file-preview d-flex align-items-center mb-2';
                filePreview.innerHTML = `
                    <img src="${e.target.result}" alt="미리보기 이미지" class="preview-image me-2" style="width: 100px; height: auto;">
                    <p class="file-name mb-0 me-2">미리보기</p>
                    <button type="button" class="btn btn-danger btn-sm remove-file" data-id="new-${fileIndex}" onclick="removeFile('new-${fileIndex}')">x</button>
                `;
                previewContainer.appendChild(filePreview);

                fileList.items.add(file); // 파일 목록에 추가
                fileIndex++;

                console.log("파일 미리보기 생성됨:", file.name);
            };
            reader.readAsDataURL(file);
        }

        productImgInput.files = fileList.files; // 파일 입력 요소에 파일 목록 설정
    }

    function removeFile(fileId) {
        console.log("removeFile 함수 호출됨, 파일 ID:", fileId);
        const previewContainer = document.getElementById('preview-images');
        const filePreview = previewContainer.querySelector(`.file-preview button[data-id="${fileId}"]`).closest('.file-preview');
        previewContainer.removeChild(filePreview);

        const index = parseInt(fileId.split('-')[1]);
        fileList.items.remove(index); // 파일 목록에서 제거
        productImgInput.files = fileList.files; // 파일 입력 요소에 파일 목록 설정
    }

    function deleteImage(imageId) {
        console.log("deleteImage 함수 호출됨, 이미지 ID:", imageId);
        fetch(`/image/${imageId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    console.log("이미지 삭제 성공, 이미지 ID:", imageId);
                    const filePreview = document.querySelector(`.file-preview .remove-file[data-id="${imageId}"]`).closest('.file-preview');
                    filePreview.parentNode.removeChild(filePreview);
                } else {
                    console.error("이미지 삭제 오류, 이미지 ID:", imageId);
                    alert('이미지 삭제 중 오류가 발생했습니다.');
                }
            })
            .catch(error => console.error('오류 발생:', error));
    }

    window.handleFiles = handleFiles;
    window.removeFile = removeFile;
    window.deleteImage = deleteImage;

    // 기존 이미지들에 대해 X 버튼 이벤트 추가
    const existingRemoveButtons = document.querySelectorAll('.remove-file');
    existingRemoveButtons.forEach((button) => {
        button.addEventListener('click', function() {
            const imageId = button.getAttribute('data-id');
            deleteImage(imageId);
        });
    });
});