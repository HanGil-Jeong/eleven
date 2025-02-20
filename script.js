$(document).ready(function() {
    // '사진 추가' 버튼 클릭 시
    $('#addImageBtn').on('click', function() {
        var imageLink = $('#imageLink').val(); // 이미지 링크 입력 필드에서 값 가져오기

        if (imageLink) {
            // 입력된 이미지 링크로 .photo-placeholder의 배경 이미지 설정
            $('#photoPlaceholder').css({
                'background-image': 'url(' + imageLink + ')',
                'background-size': 'cover',
                'background-position': 'center'
            });
        } else {
            alert("이미지 링크를 입력해주세요.");
        }
    });

    // 취소 버튼 클릭 시 초기화
    $('.cancel-btn').on('click', function() {
        $('form')[0].reset();
        $('#photoPlaceholder').css('background-image', 'none');
        $('#imageLink').val(''); // 이미지 링크 필드도 초기화
    });

    // 수정 버튼 클릭 시 데이터 저장
    $('.edit-btn').on('click', function(e) {
        e.preventDefault();

        var name = $('#name').val();
        var age = $('#age').val();
        var mbti = $('#mbti').val();
        var oneWord = $('#phrase').val(); // 'phrase'로 ID 수정
        var hobby = $('#hobby').val();
        var selfIntro = $('#bio').val(); // 'bio'로 ID 수정
        var imageLink = $('#imageLink').val(); // 이미지 링크

        if (!name || !age) {
            alert("이름과 나이는 필수 입력 항목입니다.");
            return;
        }

        // 데이터 저장 호출
        saveData(name, age, mbti, oneWord, hobby, selfIntro, imageLink);
    });

    // 데이터 저장 함수
    function saveData(name, age, mbti, oneWord, hobby, selfIntro, imageLink) {
        db.collection("users").add({
            name: name,
            age: Number(age),
            mbti: mbti,
            oneWord: oneWord,
            hobby: hobby,
            selfIntro: selfIntro,
            image: imageLink, // 입력된 이미지 링크
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(function(docRef) {
            alert("데이터가 성공적으로 저장되었습니다!");
            $('form')[0].reset();
            $('#photoPlaceholder').css('background-image', 'none');
            $('#imageLink').val(''); // 이미지 링크 입력 필드 초기화

            // 저장 성공 후 personal.html로 이동
            window.location.href = `personal.html?name=${encodeURIComponent(name)}`;
        })
        .catch(function(error) {
            console.error("데이터 저장 실패: ", error);
            alert("데이터 저장에 실패했습니다.");
        });
    }
});
