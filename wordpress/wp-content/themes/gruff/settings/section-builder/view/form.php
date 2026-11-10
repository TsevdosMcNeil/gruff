<?php
    $query = 'admin.php';
    $link = add_query_arg([
        'page' => 'section-builder',
    ],$query );
?>
 <div class="wrap addFromForManageAll sectionBuilderForm">
    <form name="addFrm" id="addFrm"  method="post" enctype="multipart/form-data">

        <div class="addFormCover">
            <div class="addFieldItems cell-12">
                <span>Section Title<b>*</b></span>
                <input type="text" name="section_name" id="section_name" value="" class="addinput">
            </div>
            <div class="addFieldItems cell-12 noPad">
                <section id="wrapper_elem" class="wrapper_elem">
                    <div class="repeat_elem" id="repeat_elem">
                        
                    </div>   
                    <input name="section_index[]" id="1" type="hidden" value="">
                </section>
                <div class="center-cont"><input type="button" id="add_more" value="Add more field" class="link outline-link solid-link link-green"></div>
            </div>
            
            <div class="addFieldItems cell-12">
                <span>Content<b>*</b></span>
                <textarea name="section_html" id="section_html" value="" class="editor"></textarea>
            </div>
            <div class="addFieldItems cell-12">
                <span>Suitable For<b>*</b></span>
                <select class="addinput" name="type">
                    <option value="0">Both</option>
                    <option value="1">Projects</option>
                    <option value="2">Stories</option>
                </select>
            </div>
            <div class="addFieldItems cell-6">
                <span>Sequence</span>
                <input type="text" name="sequence" id="sequence" value="" class="addinput">
            </div>
            <div class="addFieldItems cell-6">
                <div class="infoImg small"></div>
                <input type="file" name="icon" id="icon" class="addinput">
            </div>
            <input type="hidden" name="id" id="id" value="" />
        </div>

        <div class="coverBtnFormarea">
            <a  style="float: right; margin-left: 10px;"  href="<?= $link ?>" class="btn solid-btn btns-red">Cancel</a>
            <span>&nbsp;</span>
            <input style="float: right;" type="submit" class="btn solid-btn btns-dgreen" id="submit_button" name="" value="Save">
        </div>
    </form>
</div>
<link href="https://cdn.jsdelivr.net/dropzone/4.3.0/basic.min.css" rel="stylesheet" type="text/css" />
<script src="https://cdn.ckeditor.com/4.7.1/standard/ckeditor.js"></script>
<script type="text/javascript">
    CKEDITOR.config.basicstyles = [
        ['Bold', 'Italic', 'Underline']
    ];
    CKEDITOR.replace(section_html,{
        toolbarGroups: [
            {"name":"basicstyles","groups":["basicstyles"]},
            {"name":"document","groups":["mode"]},
        ],

    });
    CKEDITOR.config.allowedContent = true;
</script>