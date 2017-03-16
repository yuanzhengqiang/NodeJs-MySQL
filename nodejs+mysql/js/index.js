$(document).ready(function() {
	resizeModal();//调整模态框大小
}
function resizeModal() {
	$(".md-modal .block-flat").each(function() {
		if ($("body").height() - 100 < $(this).height()) {  //默认高度超过上限，则替换为上限
			$(this).css("height", ($("body").height() - 100) + "px");
			$(this).css("overflow-x", "hidden");
			$(this).css("overflow-y", "auto");
		}
	});
}