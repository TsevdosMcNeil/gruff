<div id="message">
    <p></p><button type="button" class="notice-dismiss"><span class="screen-reader-text"></span></button>
</div>
<?php
    $query = 'admin.php';
    $link = add_query_arg([
        'page' => 'section-builder-form',
    ],$query );
?>
<div class="wrap section-builder">
    <a href="<?= $link ?>" class="page-title-action button">Add a New Section</a>
    <h2>Sections</h2>
    <table class="widefat" id="contact_requests">
        <thead>
            <tr>
                <th>Section Icon</th>
                <th>Section Name</th>      
                <th>Action</th>
            </tr>
        </thead>
        <tfoot>
            <tr>
                <th>Section Icon</th>
                <th>Section Name</th>   
                <th>Action</th>
            </tr>
        </tfoot>
        <tbody>
        <?php 
        if(count($data) > 0){
            foreach ($data as $key => $value) { 
        ?>
            <tr class="single-row">
                 <td><?= $value['icon_img']; ?></td>
                 <td><?= $value['section_name']; ?></td>
                 <td>
                    <a href="javascript:void(0)" onClick="show_alert(this)">Remove</a>
                    <div class="alert" data-id="<?= $value['id'] ?>">
                        <p class="ques">Are you sure you want delete this record</b>?</p>
                        <div class="alert-opt">
                            <a href="javascript:void(0)" class="btn-yes" onClick="confirm_delete(this)">Yes Please</a>
                            <a href="javascript:void(0)" class="btn-no" onclick="hide_alert(this)">No Thanks</a>
                        </div>
                    </div>
                </td>
            </tr>
        <?php 
            }    
        }else{
        ?>
            <tr class="single-row">
                 <td colspan="3">No record(s) available</td>
            </tr>    
        <?php        
            } 
        ?>   
        </tbody>
    </table>
</div>    

