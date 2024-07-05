import utils from "../../../../support/utils";
import qAssert from "../../../../support/qassert";

class BakDbConfigPage {
  constructor(obElements) {
    this.elements = obElements;
  }

  typeBakDBName(name) {
    cy.log("输入备库名: " + name)
    cy.get(this.elements.bakdb_name).type(name);
  }

  //选择备库规格
  selectScale(cpu = 6, memory = 8) {
    cy.log("选择备库规格");
    let scale = cpu + "Core" + memory + "Gi";

    cy.get(this.elements.select_scale)
      .click()
      .then(() => {
        cy.contains(scale).click();
      });
  }

  //选择节点, 暂时用不上
  selectNode() {}

  //选择网络, 待补充
  selectNet() {}

  //增加数据卷空间
  clickDataVolumeAddButton(times = 0) {
    cy.log("增加数据卷空间");
    utils.clickButtonMultipleTimes(
      this.elements.data_storage_add_button,
      times
    );
  }

  //选择是否启用数据卷压缩
  selectDataCompression(flag = false) {
    cy.log("选择是否启用数据卷压缩");
    if (flag) {
      cy.get(this.elements.data_compression)
        .click()
        .then(() => {
          cy.contains("启用").click({ force: true });
        });
    }
  }

  //增加快照空间
  clickSnapZoneAddButton(times = 0) {
    cy.log("增加快照空间");
    utils.clickButtonMultipleTimes(
      this.elements.snapshot_zone_add_button,
      times
    );
  }

  //增加归档空间
  clickArchiveZoneAddButton(times = 0) {
    cy.log("增加归档空间");
    utils.clickButtonMultipleTimes(
      this.elements.archive_zone_add_button,
      times
    );
  }

  //选择是否启用归档压缩
  selectArchiveCompression(flag = false) {
    cy.log("选择是否启用归档压缩");
    if (flag) {
      cy.get(this.elements.archive_compression)
        .click()
        .then(() => {
          cy.get(this.elements.enable_archive_compression)
            .contains("启用")
            .click({ force: true });
        });
    }
  }

  //增加DataFileSize
  clickDataFileSizeAddButton(times = 0) {
    cy.log("增加DataFileSize");
    utils.clickButtonMultipleTimes(
      this.elements.data_file_size_add_button,
      times
    );
  }

  //增加LogDiskSize
  clickLogDiskSizeAddButton(times = 0) {
    cy.log("增加LogDiskSize");
    utils.clickButtonMultipleTimes(
      this.elements.log_disk_size_add_button,
      times
    );
  }

  //点击下一步
  clickNextStepButton() {
    cy.log("点击下一步");
    qAssert.assertButtonYes(this.elements.next_step_button);
    cy.get(this.elements.next_step_button).click();
  }

  //断言创建成功
  assertCreateBakDBSuccess() {
    cy.log("断言创建成功");
    cy.contains("创建主库备份集");
  }

  assertGetManualDoc(){
    cy.contains("创建主库备份集");
  }


}
export default BakDbConfigPage;
